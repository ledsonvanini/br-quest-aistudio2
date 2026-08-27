import React, { useState, useEffect } from 'react';
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
  Moon,
  Settings,
  Disc,
  Flame,
  Award,
  BookOpen,
  Gauge,
  Layers,
  Mountain,
  Scroll,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Cpu,
  Flag,
  Globe,
  Telescope,
  MousePointerClick,
  Crosshair,
  Hand,
  Info,
  X,
  Leaf,
  Bird,
  Trees,
  Sparkles,
  ShieldAlert,
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
import { SpeechBubbleTooltip } from './common/SpeechBubbleTooltip';
import { ECMWF_TEMP_COLOR_STOPS } from '../services/climateService';
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
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  onFocusState,
  isRadioOpen = true,
  onToggleRadio,
  activeMusicCategory = 'state_anthems',
  onSelectMusicCategory,
  selectedRadioEraId = 'catedral_1930_1940',
  onSelectRadioEra,
  currentStationName = 'Rádio Nacional (860 kHz)',
  currentTrackTitle = 'Hino Oficial',
  selectedStateId = 'RJ',
  isRadioPlaying = false,
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
  // Fixed contextual label / tooltip state for the top menu
  const [hoveredMenuTooltip, setHoveredMenuTooltip] = useState<MenuTooltipInfo | null>(null);

  const bindTooltip = (info: MenuTooltipInfo) => ({
    onMouseEnter: () => setHoveredMenuTooltip(info),
    onMouseLeave: () =>
      setHoveredMenuTooltip((curr) => (curr?.title === info.title ? null : curr)),
  });

  // Helper to ensure any top menu action triggers auto-center if the camera is not centered
  const triggerAutoCenter = () => {
    onResetViewIfNotCentered?.();
  };

  // Coherent climate mode change with smart presets
  const handleSmartClimateModeChange = (mode: ClimateMode) => {
    audioEngine.playSfx('click');
    onClimateModeChange?.(mode);

    if (mode === 'ventos_aliseos') {
      // Vento combina com nuvens, ondas e atmosfera
      if (!isCloudsActive) onToggleClouds?.();
      if (!isWavesActive) onToggleWaves?.();
      if (!isAtmosphereActive) onToggleAtmosphere?.();
      if (isRainSimActive) onToggleRainSim?.();
    } else if (mode === 'precipitacao_zcas') {
      // Chuva / ZCAS combina com simulação de chuva ativa e nuvens
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
      {/* 1. MENU PRINCIPAL NO TOPO EM UMA ÚNICA LINHA LIMPA */}
      {/* ========================================================================= */}
      <header
        id="menu-global-topo-unificado"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="menu-global-topo-unificado menu-superior-status fixed top-0.5 sm:top-1 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto max-w-[98vw] font-sans select-none"
      >
        <div className="bg-[#020d24]/40 backdrop-blur-md border border-amber-500/35 rounded-2xl px-2.5 sm:px-3 py-1 shadow-2xl shadow-black/80 flex items-center gap-2 text-white flex-nowrap whitespace-nowrap overflow-visible">
          
          {/* ========================================================================= */}
          {/* SEÇÃO 1: ÍCONES PARA CADA MODO: [Clima, Biodiversidade, Geopolítica, Globo3D, Navegação] */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
            
            {/* 1. CLIMA & TELEMETRIA */}
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
                  badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                  description:
                    'Modo Meteorológico: Radares de calor ECMWF (-4°C a 36°C), Ventos Alísios, Rios Voadores e ZCAS.',
                })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'clima'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Temperatura e Clima"
              >
                <Thermometer className="w-4 h-4" />
              </button>
            </div>

            {/* 2. BIODIVERSIDADE BRASILEIRA */}
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
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'biodiversidade'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-slate-950 border-emerald-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Biodiversidade Brasileira"
              >
                <Leaf className="w-4 h-4" />
              </button>
            </div>

            {/* 3. GEOPOLÍTICA & DEMOGRAFIA */}
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
                  badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                  description:
                    'Raio-X do Brasil: Miscigenação, Homens e Mulheres, Partidos Políticos, Densidade, Natalidade, Mortalidade e Alfabetização.',
                })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'geopolitica'
                    ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-slate-950 border-cyan-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Geopolítica e Demografia"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* 4. GLOBO TERRESTRE 3D */}
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
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
                  description:
                    'Planeta Terra em 3D com dados de satélite da NASA, vetores dourados dos 27 estados e brasões heráldicos.',
                })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'globo3d'
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-slate-950 border-cyan-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Globo Terrestre 3D"
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>

            {/* 5. AVENTURA & NAVEGAÇÃO */}
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
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                  description:
                    'Navegue pelo relevo sombreado do Brasil, explore os 27 estados e conquiste as Insígnias dos Guardiões.',
                })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'aventura'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Modo Aventura e Navegação"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>

            {/* 6. MUSICALIDADES DO BRASIL */}
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
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'musicalidades'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 border-yellow-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Musicalidades do Brasil"
              >
                <Radio className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Divisor Vertical */}
          <div className="h-6 w-[1px] bg-slate-800 shrink-0" />

          {/* ========================================================================= */}
          {/* SEÇÃO 2: SEÇÃO DE CONFIGURAÇÕES PARA CADA SEÇÃO */}
          {/* ========================================================================= */}

          {/* 2.A QUANDO EM AVENTURA: [Estilos de Terreno / Relevo] + [Filtros BR, N, NE, CO, SE, S] + [Insígnias] */}
          {mainMode === 'aventura' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              
              {/* Relevo Sombreado (Padrão: Relevo/Relevo) */}
              {onTerrainProviderChange && onVisualStyleChange && (
                <div className="flex items-center gap-0.5 pr-1 border-r border-slate-800">
                  {/* Relevo Sombreado */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'shaded_relief'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                      aria-label="Relevo Sombreado"
                    >
                      <Mountain className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cores Naturais */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'natural_earth'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                      aria-label="Cores Naturais e Biomas"
                    >
                      <Sun className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pergaminho Histórico */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'voyager_parchment'
                          ? 'bg-amber-600 text-amber-50 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      aria-label="Pergaminho Histórico Cartográfico"
                    >
                      <Scroll className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Coroplético */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'choropleth'
                          ? 'bg-teal-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800'
                      }`}
                      aria-label="Capa Coroplética Temática"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Filtros Regionais: [BR] [N] [NE] [CO] [SE] [S] */}
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
                  <div key={reg.id} className="relative">
                    <button
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
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] sm:text-[11px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                    >
                      {reg.label}
                    </button>
                  </div>
                );
              })}

              {/* Botão: Mostrar Vizinhos / Fronteiras da América do Sul */}
              {onToggleNeighbors && (
                <div className="relative">
                  <button
                    id="btn-toggle-vizinhos"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onToggleNeighbors();
                    }}
                    {...bindTooltip({
                      title: 'Mostrar Vizinhos & Fronteiras',
                      badge: showNeighbors ? 'Ativo' : 'Oculto',
                      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                      description:
                        'Ilumina as fronteiras internacionais com os 10 países vizinhos da América do Sul e estados limítrofes.',
                    })}
                    className={`btn-toggle-vizinhos w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      showNeighbors
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-emerald-300 hover:border-emerald-500/40'
                    }`}
                    aria-label="Mostrar Países e Estados Vizinhos"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Santuário de Insígnias */}
              {onNavigateToSanctuary && (
                <div className="relative">
                  <button
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
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 flex items-center justify-center transition cursor-pointer"
                    aria-label="Santuário de Insígnias"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2.B QUANDO EM CLIMA: [Temperatura] [Ventos & Rios] [ZCAS Chuvas] [ENSO] + [Observatório Ambiental] */}
          {mainMode === 'clima' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* 1. Temperatura ECMWF */}
              <div className="relative">
                <button
                  onClick={() => handleSmartClimateModeChange('temperaturas_frentes')}
                  {...bindTooltip({
                    title: 'Temperatura & Calor (ECMWF)',
                    badge: '-4°C a 36°C',
                    description:
                      'Mapa térmico coroplético em alta resolução com frentes quentes e frias sobre o Brasil.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'temperaturas_frentes'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Temperatura e Calor"
                >
                  <Thermometer className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Ventos Alísios & Rios Voadores */}
              <div className="relative">
                <button
                  onClick={() => handleSmartClimateModeChange('ventos_aliseos')}
                  {...bindTooltip({
                    title: 'Ventos Alísios & Rios Voadores',
                    badge: 'Vapor Amazônico',
                    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
                    description:
                      'Ativa fluxo de vento, nuvens volumétricas e ondas marinhas pelo continente.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'ventos_aliseos'
                      ? 'bg-sky-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Ventos Alísios e Rios Voadores"
                >
                  <Wind className="w-4 h-4" />
                </button>
              </div>

              {/* 3. ZCAS & Chuvas */}
              <div className="relative">
                <button
                  onClick={() => handleSmartClimateModeChange('precipitacao_zcas')}
                  {...bindTooltip({
                    title: 'ZCAS & Chuvas Continentais',
                    badge: 'Convergência',
                    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                    description:
                      'Banda diagonal de convergência unindo a Amazônia ao Sudeste com chuva e nuvens carregadas.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'precipitacao_zcas'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="ZCAS e Chuvas Continentais"
                >
                  <CloudRain className="w-4 h-4" />
                </button>
              </div>

              {/* 4. El Niño / La Niña (ENSO) */}
              <div className="relative">
                <button
                  onClick={() => handleSmartClimateModeChange('el_nino_la_nina')}
                  {...bindTooltip({
                    title: 'El Niño & La Niña (ENSO)',
                    badge: 'Oceano Pacífico',
                    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                    description:
                      'Variação térmica do Pacífico Equatorial que impacta o Semiárido e o Sul do país.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'el_nino_la_nina'
                      ? 'bg-rose-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="El Niño e La Niña"
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>

              {/* 5. Observatório Ambiental & Estações INMET */}
              {onToggleObservatorio && (
                <div className="relative pl-0.5 border-l border-slate-800">
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
                    className={`btn-toggle-observatorio-topo w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isObservatorioOpen
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105'
                        : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800 hover:text-amber-300 hover:border-amber-500/50'
                    }`}
                    aria-label="Observatório Ambiental"
                  >
                    <Telescope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2.C QUANDO EM BIODIVERSIDADE: Sequência [Fauna, Flora, Fungos, Todos os Reinos, Livros] + [Painel Filtro] */}
          {mainMode === 'biodiversidade' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* 1. Fauna Brasileira */}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    biodiversityKingdom === 'fauna'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Fauna Brasileira"
                >
                  <Bird className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Flora do Brasil */}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    biodiversityKingdom === 'flora'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Flora do Brasil"
                >
                  <Trees className="w-4 h-4" />
                </button>
              </div>

              {/* 3. Fungos & Microbioma (Ícone de Cogumelo) */}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    biodiversityKingdom === 'fungi_micro'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
                    className="w-4 h-4"
                  >
                    <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
                    <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
                    <circle cx="8" cy="8.5" r="1" fill="currentColor" />
                    <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
                    <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
                  </svg>
                </button>
              </div>

              {/* 4. Todos os Reinos Biológicos */}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    biodiversityKingdom === 'all'
                      ? 'bg-teal-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Todos os Reinos"
                >
                  <Leaf className="w-4 h-4" />
                </button>
              </div>

              {/* 5. Livro Vermelho (Espécies Ameaçadas) */}
              <div className="relative pl-0.5 border-l border-slate-800">
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                    isBiodiversityThreatenedOnly
                      ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold shadow-md scale-105'
                      : 'bg-slate-900 text-rose-400 border-slate-700 hover:bg-slate-800 hover:text-rose-300'
                  }`}
                  aria-label="Livro Vermelho de Espécies Ameaçadas"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>

              {/* 6. Toggle Painel/Catálogo de Biodiversidade */}
              {onToggleBiodiversityPanel && (
                <div className="relative pl-0.5 border-l border-slate-800">
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isBiodiversityPanelOpen
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-bold scale-105'
                        : 'bg-slate-900 text-emerald-400 border-slate-700 hover:bg-slate-800 hover:text-emerald-300 hover:border-emerald-500/50'
                    }`}
                    aria-label="Catálogo de Biodiversidade"
                  >
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2.D QUANDO EM GEOPOLÍTICA: [Miscigenação] [Gênero] [Densidade] [Natalidade] [Mortalidade] [Analfabetismo] [Partidos] + [Painel] */}
          {mainMode === 'geopolitica' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* 1. Miscigenação & Etnias */}
              <div className="relative">
                <button
                  id="btn-geopol-miscigenacao"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('miscigenacao');
                  }}
                  {...bindTooltip({
                    title: 'Miscigenação & Composição Étnica',
                    badge: 'Censo 2022',
                    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                    description: 'Composição de Pardos (45,3%), Brancos (43,5%), Pretos (10,2%), Indígenas e Amarelos por estado.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'miscigenacao'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                  }`}
                  aria-label="Miscigenação e Etnias"
                >
                  <Users className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Homens & Mulheres (Gênero) */}
              <div className="relative">
                <button
                  id="btn-geopol-genero"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('genero');
                  }}
                  {...bindTooltip({
                    title: 'Distribuição por Sexo & Gênero',
                    badge: '51,5% Mulheres',
                    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
                    description: 'Proporção de mulheres e homens, razão de sexo por UF e pirâmide demográfica.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'genero'
                      ? 'bg-pink-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-pink-300 hover:bg-slate-800'
                  }`}
                  aria-label="Gênero e Sexo"
                >
                  <Percent className="w-4 h-4" />
                </button>
              </div>

              {/* 3. Densidade Demográfica */}
              <div className="relative">
                <button
                  id="btn-geopol-densidade"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('densidade');
                  }}
                  {...bindTooltip({
                    title: 'Densidade Demográfica & Urbanização',
                    badge: 'hab/km²',
                    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
                    description: 'Concentração de habitantes por quilômetro quadrado e índice de urbanização por estado.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'densidade'
                      ? 'bg-sky-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800'
                  }`}
                  aria-label="Densidade Demográfica"
                >
                  <Building2 className="w-4 h-4" />
                </button>
              </div>

              {/* 4. Natalidade */}
              <div className="relative">
                <button
                  id="btn-geopol-natalidade"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('natalidade');
                  }}
                  {...bindTooltip({
                    title: 'Natalidade & Taxa de Fecundidade',
                    badge: 'Nascimentos ‰',
                    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                    description: 'Taxa de natalidade por mil habitantes e número médio de filhos por mulher.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'natalidade'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                  }`}
                  aria-label="Natalidade e Fecundidade"
                >
                  <Baby className="w-4 h-4" />
                </button>
              </div>

              {/* 5. Saúde, Longevidade & Mortalidade */}
              <div className="relative">
                <button
                  id="btn-geopol-mortalidade"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('mortalidade');
                  }}
                  {...bindTooltip({
                    title: 'Saúde, Longevidade & Mortalidade',
                    badge: 'DataSUS',
                    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                    description: 'Expectativa de vida ao nascer (76,2 anos) e taxas de mortalidade infantil por estado.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'mortalidade'
                      ? 'bg-rose-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
                  }`}
                  aria-label="Saúde, Longevidade e Mortalidade"
                >
                  <HeartPulse className="w-4 h-4" />
                </button>
              </div>

              {/* 6. Educação & Alfabetização */}
              <div className="relative">
                <button
                  id="btn-geopol-analfabetismo"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('analfabetismo');
                  }}
                  {...bindTooltip({
                    title: 'Educação & Alfabetização',
                    badge: 'PNAD / Censo',
                    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                    description: 'Taxa de alfabetização (94,4% nacional), anos médios de estudo e taxas estaduais.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'analfabetismo'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                  }`}
                  aria-label="Educação e Alfabetização"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
              </div>

              {/* 7. Governo & Partidos Políticos */}
              <div className="relative">
                <button
                  id="btn-geopol-partidos"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onGeopoliticaMetricChange?.('partidos');
                  }}
                  {...bindTooltip({
                    title: 'Governo & Partidos Políticos',
                    badge: 'TSE Eleições',
                    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
                    description: 'Governadores eleitos, distribuição partidária dos 27 estados e representação.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    geopoliticaMetric === 'partidos'
                      ? 'bg-purple-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800'
                  }`}
                  aria-label="Governo e Partidos Políticos"
                >
                  <Vote className="w-4 h-4" />
                </button>
              </div>

              {/* 8. Toggle Painel Geopolítico */}
              {onToggleGeopoliticaPanel && (
                <div className="relative pl-0.5 border-l border-slate-800">
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isGeopoliticaPanelOpen
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md font-bold scale-105'
                        : 'bg-slate-900 text-cyan-400 border-slate-700 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-500/50'
                    }`}
                    aria-label="Observatório Geopolítico"
                  >
                    <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2.C QUANDO EM MUSICALIDADES: [Hinos] [Top 5] [Nacional] + [Gabinete do Rádio] */}
          {mainMode === 'musicalidades' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* Hinos Oficiais */}
              <div className="relative">
                <button
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'state_anthems'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Hinos Oficiais"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>

              {/* Top 5 */}
              <div className="relative">
                <button
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'top5'
                      ? 'bg-orange-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Top 5 Clássicos"
                >
                  <Flame className="w-4 h-4" />
                </button>
              </div>

              {/* Hinos Nacionais */}
              <div className="relative">
                <button
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'national'
                      ? 'bg-yellow-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Hinos Cívicos Nacionais"
                >
                  <Award className="w-4 h-4" />
                </button>
              </div>

              {/* Gabinete do Rádio Retrô (Exibir / Ocultar App do Rádio) */}
              {onToggleRadio && (
                <div className="relative">
                  <button
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isRadioOpen
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105'
                        : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800 hover:text-amber-300 hover:border-amber-500/50'
                    }`}
                    aria-label="Exibir/Ocultar Rádio"
                  >
                    <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2.D QUANDO EM GLOBO 3D: [Texturas NASA / Luzes / Biomas] + [Fronteiras 3D] + [Nuvens Orbitais] + [Auto-Rotação] + [Modo Brasões] */}
          {mainMode === 'globo3d' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* Seletor de Texturas Orbitais */}
              {onGlobeTextureModeChange && (
                <div className="flex items-center gap-0.5 pr-1 border-r border-slate-800">
                  {/* NASA Blue Marble (Satélite de Alta Precisão) */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        globeTextureMode === 'nasa_satellite'
                          ? 'bg-blue-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      aria-label="Textura NASA Blue Marble"
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                  </div>

                  {/* NASA Night Lights (Cidades Iluminadas à Noite) */}
                  <div className="relative">
                    <button
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        globeTextureMode === 'night_lights'
                          ? 'bg-indigo-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      aria-label="Luzes Noturnas da Terra"
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Fronteiras Vetoriais Douradas dos 27 Estados */}
              {onToggleGlobeBorders && (
                <div className="relative">
                  <button
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      isGlobeBordersActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    aria-label="Fronteiras Vetoriais Douradas"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Nuvens Atmosféricas Orbitais */}
              {onToggleGlobeClouds && (
                <div className="relative">
                  <button
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      isGlobeCloudsActive
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    aria-label="Nuvens Atmosféricas Orbitais"
                  >
                    <Cloud className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Auto-Rotação Orbital (Auto-Spin) */}
              {onToggleGlobeAutoRotate && (
                <div className="relative">
                  <button
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      isGlobeAutoRotateActive
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    aria-label="Rotação Orbital Contínua"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Modo de Exibição dos Brasões */}
              {onGlobePinModeChange && (
                <div className="relative">
                  <button
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      globePinMode === 'all'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    aria-label="Modo de Exibição dos Brasões"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Centralizar Brasil / Reset Câmera */}
              {onResetGlobeCamera && (
                <div className="relative">
                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onResetGlobeCamera();
                    }}
                    {...bindTooltip({
                      title: 'Centralizar no Brasil',
                      badge: 'Reset Órbita',
                      description: 'Posiciona a câmera orbital centrada na América do Sul e nos 27 estados do Brasil.',
                    })}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                    aria-label="Centralizar no Brasil"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Divisor Vertical */}
          <div className="h-6 w-[1px] bg-slate-800 shrink-0" />

          {/* ========================================================================= */}
          {/* SEÇÃO 3: SEÇÃO DE ÍCONES COMUNS / AMBIENTAIS (Chuva, Nuvens, Ondas, Luz Solar, etc.) */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
            
            {/* Simular Chuva */}
            {onToggleRainSim && (
              <div className="relative">
                <button
                  onClick={onToggleRainSim}
                  {...bindTooltip({
                    title: 'Simulador de Chuva 3D',
                    badge: isRainSimActive ? 'Ativo' : 'Inativo',
                    description: 'Simulação de partículas de chuva em 3D sobre o relevo do país.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isRainSimActive
                      ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-md font-bold scale-105'
                      : 'text-cyan-400 hover:bg-cyan-950/60 hover:text-cyan-300'
                  }`}
                  aria-label="Simular Chuva"
                >
                  <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Nuvens */}
            {onToggleClouds && (
              <div className="relative">
                <button
                  onClick={onToggleClouds}
                  {...bindTooltip({
                    title: 'Nuvens Cumulus',
                    badge: isCloudsActive ? 'Visível' : 'Oculto',
                    description: 'Camada de nuvens animadas que projetam sombras dinâmicas no mapa.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isCloudsActive
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Nuvens no Relevo"
                >
                  <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Ondas Oceânicas */}
            {onToggleWaves && (
              <div className="relative">
                <button
                  onClick={onToggleWaves}
                  {...bindTooltip({
                    title: 'Ondas do Oceano Atlântico',
                    badge: isWavesActive ? 'Visível' : 'Oculto',
                    description:
                      'Dinâmica das correntes marinhas e espuma na costa litorânea de 7.491 km.',
                  })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isWavesActive
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Ondas do Atlântico"
                >
                  <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Botão de Ciclo de Astro e Atmosfera: [Sol, Lua, A - (auto)] */}
            {onToggleAtmosphere && (
              <div className="relative">
                <button
                  id="btn-toggle-astro-celeste"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onToggleAtmosphere();
                  }}
                  {...bindTooltip({
                    title:
                      celestialTimeOverride === 'day'
                        ? 'Astro & Atmosfera: Sol'
                        : celestialTimeOverride === 'night'
                        ? 'Astro & Atmosfera: Lua'
                        : 'Astro & Atmosfera: Automático',
                    badge:
                      celestialTimeOverride === 'day'
                        ? 'Sol (Dia)'
                        : celestialTimeOverride === 'night'
                        ? 'Lua (Noite)'
                        : 'A - (Auto)',
                    badgeColor:
                      celestialTimeOverride === 'day'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                        : celestialTimeOverride === 'night'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                    description:
                      celestialTimeOverride === 'day'
                        ? 'Sol radiante, partículas de luz solar e atmosfera diurna.'
                        : celestialTimeOverride === 'night'
                        ? 'Lua com fases astronômicas e iluminação noturna serena.'
                        : 'Sincronizado em tempo real com o horário e a elevação solar de Brasília.',
                  })}
                  className={`btn-toggle-astro-celeste w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                    celestialTimeOverride === 'day'
                      ? 'bg-amber-500/30 text-amber-300 border-amber-400/60 shadow-sm'
                      : celestialTimeOverride === 'night'
                      ? 'bg-blue-500/30 text-blue-200 border-blue-400/60 shadow-sm'
                      : 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 shadow-sm'
                  }`}
                  aria-label="Alternar Astro e Atmosfera [Sol, Lua, Auto]"
                >
                  {celestialTimeOverride === 'day' ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  ) : celestialTimeOverride === 'night' ? (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                  ) : (
                    <div className="flex items-center justify-center font-bold text-[11px] sm:text-xs font-mono text-emerald-300 leading-none">
                      <span className="border border-emerald-400/60 rounded px-1 py-0.2 bg-emerald-500/20">A</span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Configurações Gerais */}
            {onOpenSettings && (
              <div className="relative">
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenSettings();
                  }}
                  {...bindTooltip({
                    title: 'Configurações Gerais',
                    description: 'Ajuste volume do áudio, efeitos sonoros e telemetria.',
                  })}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 flex items-center justify-center transition cursor-pointer"
                  aria-label="Configurações"
                >
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DISPLAY FIXO UNIFICADO: BALÃO / LABEL OU LEMBRETE DE NAVEGAÇÃO           */}
        {/* ========================================================================= */}
        <div
          id="container-display-labels-topo"
          className="container-display-labels-topo relative mt-1.5 flex items-center justify-center pointer-events-none min-h-[30px] w-full"
        >
          {/* BALÃO / LABEL DA FERRAMENTA SOB O CURSOR (FADE IN / FADE OUT SUAVE EM TODOS OS 3 MODOS) */}
          <div
            id="balao-ferramenta-topmenu-fixo"
            className={`balao-ferramenta-topmenu-fixo absolute flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-400/50 shadow-xl shadow-black text-white text-xs max-w-[92vw] transition-opacity duration-200 ease-in-out z-10 ${
              hoveredMenuTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
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
            <span className="text-[11px] text-slate-300 font-sans hidden sm:inline truncate max-w-lg">
              {hoveredMenuTooltip?.description || ''}
            </span>
          </div>

          {/* LEMBRETE DE NAVEGAÇÃO COMPACTO: FADE IN / FADE OUT QUANDO O MOUSE ESTIVER SOBRE O MAPA DO BRASIL */}
          <div
            id="lembrete-navegacao-wrapper"
            className={`transition-opacity duration-200 ease-in-out ${
              !hoveredMenuTooltip && hoveredStateId && mainMode === 'aventura'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              id="lembrete-navegacao-fixo-topo"
              className="lembrete-navegacao-fixo-topo flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 shadow-lg shadow-black text-white text-[10px] sm:text-[11px] font-sans shrink-0"
            >
              <div className="flex items-center gap-1 font-medium">
                <MousePointerClick className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300">
                  <strong className="text-emerald-300">Botão Esquerdo:</strong> Focar & Inspecionar
                </span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1 text-slate-300 font-medium">
                <kbd className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-mono text-[9px] text-amber-300 font-bold">
                  Esc
                </kbd>
                <span>Restaurar Mapa</span>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

