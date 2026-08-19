import React from 'react';
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
} from 'lucide-react';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { SpeechBubbleTooltip } from './common/SpeechBubbleTooltip';
import { ECMWF_TEMP_COLOR_STOPS } from '../services/climateService';
import { TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme } from '../types';

export type AppMainMode = 'aventura' | 'clima' | 'musicalidades';

interface Props {
  // Active App Module
  mainMode: AppMainMode;
  onSelectMainMode: (mode: AppMainMode) => void;

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

  // General Settings
  onOpenSettings?: () => void;
}

export const TopGlobalNavMenu: React.FC<Props> = ({
  mainMode,
  onSelectMainMode,
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
  onOpenSettings,
}) => {
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
        className="menu-global-topo-unificado menu-superior-status fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto max-w-[98vw] font-sans select-none"
      >
        <div className="bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500/60 rounded-2xl px-2.5 sm:px-3 py-1.5 shadow-2xl shadow-black/90 flex items-center gap-2 text-white flex-nowrap whitespace-nowrap overflow-visible">
          
          {/* ========================================================================= */}
          {/* SEÇÃO 1: ÍCONES PARA CADA MODO (1º Aventura | 2º Clima | 3º Musicalidades) */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
            
            {/* MODO 1: AVENTURA / NAVEGAÇÃO (Padrão ao carregar) */}
            <div className="relative group">
              <button
                id="btn-modo-aventura"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('aventura');
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'aventura'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Modo Aventura e Navegação"
              >
                <Compass className="w-4 h-4" />
              </button>

              <SpeechBubbleTooltip
                title="Aventura & Navegação"
                badge="Exploração Cívica"
                badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                description="Navegue pelo relevo sombreado do Brasil, explore os 27 estados e conquiste as Insígnias dos Guardiões."
              />
            </div>

            {/* MODO 2: CLIMA & AMBIENTE */}
            <div className="relative group">
              <button
                id="btn-modo-clima"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('clima');
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'clima'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Temperatura e Clima"
              >
                <Thermometer className="w-4 h-4" />
              </button>

              <SpeechBubbleTooltip
                title="Clima & Telemetria"
                badge="Tempo Real"
                badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                description="Modo Meteorológico: Radares de calor ECMWF (-4°C a 36°C), Ventos Alísios, Rios Voadores e ZCAS."
              />
            </div>

            {/* MODO 3: MUSICALIDADES */}
            <div className="relative group">
              <button
                id="btn-modo-musicalidades"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('musicalidades');
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'musicalidades'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 border-yellow-300 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Musicalidades do Brasil"
              >
                <Radio className="w-4 h-4" />
              </button>

              <SpeechBubbleTooltip
                title="Musicalidades do Brasil"
                badge="Acervo Sonoro"
                badgeColor="bg-amber-500/20 text-amber-300 border-amber-400/40"
                description="Acervo histórico com Hinos Oficiais, Top 5 Regionais, Hinos Nacionais e Rádios Vintage de 1920 a 1990."
              />
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
                  <div className="relative group">
                    <button
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onVisualStyleChange('tiles');
                        onTerrainProviderChange('shaded_relief');
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'shaded_relief'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                      aria-label="Relevo Sombreado"
                    >
                      <Mountain className="w-4 h-4" />
                    </button>

                    <SpeechBubbleTooltip
                      title="Relevo Sombreado Altimétrico"
                      badge="Padrão"
                      description="Relevo topográfico sombreado com curvas de nível e profundidade geomorfológica do Brasil."
                    />
                  </div>

                  {/* Cores Naturais */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onVisualStyleChange('tiles');
                        onTerrainProviderChange('natural_earth');
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'natural_earth'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                      aria-label="Cores Naturais e Biomas"
                    >
                      <Sun className="w-4 h-4" />
                    </button>

                    <SpeechBubbleTooltip
                      title="Cores Naturais da Terra"
                      badge="Biomas"
                      description="Coloração verdejante da Amazônia, Mata Atlântica, Cerrado, Caatinga, Pantanal e Pampa."
                    />
                  </div>

                  {/* Pergaminho Histórico */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onVisualStyleChange('tiles');
                        onTerrainProviderChange('voyager_parchment');
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'tiles' && terrainProvider === 'voyager_parchment'
                          ? 'bg-amber-600 text-amber-50 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      aria-label="Pergaminho Histórico Cartográfico"
                    >
                      <Scroll className="w-4 h-4" />
                    </button>

                    <SpeechBubbleTooltip
                      title="Pergaminho das Grandes Navegações"
                      badge="Vintage"
                      badgeColor="bg-amber-500/20 text-amber-300 border-amber-400/40"
                      description="Textura de papel envelhecido, tons sepia e estética das caravelas do século XVI."
                    />
                  </div>

                  {/* Coroplético */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onVisualStyleChange('choropleth');
                        onTerrainProviderChange('muted_gray');
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        visualStyle === 'choropleth'
                          ? 'bg-teal-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800'
                      }`}
                      aria-label="Capa Coroplética Temática"
                    >
                      <Layers className="w-4 h-4" />
                    </button>

                    <SpeechBubbleTooltip
                      title="Divisão Político-Administrativa"
                      badge="Coroplético"
                      description="Destaque vetorial nítido das fronteiras dos 27 estados e regiões da federação."
                    />
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
                  <div key={reg.id} className="relative group">
                    <button
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onSelectRegionFilter?.(reg.id);
                      }}
                      onMouseEnter={() => onHoverRegionFilter?.(reg.id)}
                      onMouseLeave={() => onHoverRegionFilter?.(null)}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] sm:text-[11px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm scale-105'
                          : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                      }`}
                    >
                      {reg.label}
                    </button>

                    <SpeechBubbleTooltip
                      title={`Filtro Regional: ${reg.label}`}
                      description={reg.desc}
                    />
                  </div>
                );
              })}

              {/* Botão: Mostrar Vizinhos / Fronteiras da América do Sul */}
              {onToggleNeighbors && (
                <div className="relative group">
                  <button
                    id="btn-toggle-vizinhos"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onToggleNeighbors();
                    }}
                    className={`btn-toggle-vizinhos w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      showNeighbors
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-emerald-300 hover:border-emerald-500/40'
                    }`}
                    aria-label="Mostrar Países e Estados Vizinhos"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  <SpeechBubbleTooltip
                    title="Mostrar Vizinhos & Fronteiras"
                    badge={showNeighbors ? 'Ativo' : 'Oculto'}
                    badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    description="Ilumina as fronteiras internacionais com os 10 países vizinhos da América do Sul e estados limítrofes."
                  />
                </div>
              )}

              {/* Santuário de Insígnias */}
              {onNavigateToSanctuary && (
                <div className="relative group">
                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onNavigateToSanctuary();
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 flex items-center justify-center transition cursor-pointer"
                    aria-label="Santuário de Insígnias"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  </button>

                  <SpeechBubbleTooltip
                    title="Santuário de Insígnias"
                    badge={`Nível ${playerLevel} • ${playerXp} XP`}
                    description="Cofre sagrado com as insígnias e relíquias conquistadas em suas jornadas."
                  />
                </div>
              )}
            </div>
          )}

          {/* 2.B QUANDO EM CLIMA: [Temperatura] [Ventos & Rios] [ZCAS Chuvas] [ENSO] + [Observatório Ambiental] */}
          {mainMode === 'clima' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* 1. Temperatura ECMWF */}
              <div className="relative group">
                <button
                  onClick={() => handleSmartClimateModeChange('temperaturas_frentes')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'temperaturas_frentes'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Temperatura e Calor"
                >
                  <Thermometer className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Temperatura & Calor (ECMWF)"
                  badge="-4°C a 36°C"
                  description="Mapa térmico coroplético em alta resolução com frentes quentes e frias sobre o Brasil."
                />
              </div>

              {/* 2. Ventos Alísios & Rios Voadores */}
              <div className="relative group">
                <button
                  onClick={() => handleSmartClimateModeChange('ventos_aliseos')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'ventos_aliseos'
                      ? 'bg-sky-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Ventos Alísios e Rios Voadores"
                >
                  <Wind className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Ventos Alísios & Rios Voadores"
                  badge="Vapor Amazônico"
                  badgeColor="bg-sky-500/20 text-sky-300 border-sky-400/40"
                  description="Ativa fluxo de vento, nuvens volumétricas e ondas marinhas pelo continente."
                />
              </div>

              {/* 3. ZCAS & Chuvas */}
              <div className="relative group">
                <button
                  onClick={() => handleSmartClimateModeChange('precipitacao_zcas')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'precipitacao_zcas'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="ZCAS e Chuvas Continentais"
                >
                  <CloudRain className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="ZCAS & Chuvas Continentais"
                  badge="Convergência"
                  badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                  description="Banda diagonal de convergência unindo a Amazônia ao Sudeste com chuva e nuvens carregadas."
                />
              </div>

              {/* 4. El Niño / La Niña (ENSO) */}
              <div className="relative group">
                <button
                  onClick={() => handleSmartClimateModeChange('el_nino_la_nina')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    climateMode === 'el_nino_la_nina'
                      ? 'bg-rose-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="El Niño e La Niña"
                >
                  <Activity className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="El Niño & La Niña (ENSO)"
                  badge="Oceano Pacífico"
                  badgeColor="bg-rose-500/20 text-rose-300 border-rose-400/40"
                  description="Variação térmica do Pacífico Equatorial que impacta o Semiárido e o Sul do país."
                />
              </div>

              {/* 5. Observatório Ambiental & Estações INMET */}
              {onToggleObservatorio && (
                <div className="relative group pl-0.5 border-l border-slate-800">
                  <button
                    id="btn-toggle-observatorio-topo"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onToggleObservatorio();
                    }}
                    className={`btn-toggle-observatorio-topo w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isObservatorioOpen
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105'
                        : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800 hover:text-amber-300 hover:border-amber-500/50'
                    }`}
                    aria-label="Observatório Ambiental"
                  >
                    <Telescope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <SpeechBubbleTooltip
                    title="Observatório Ambiental"
                    badge={isObservatorioOpen ? 'Aberto' : 'Recolhido'}
                    badgeColor={isObservatorioOpen ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' : 'bg-slate-800 text-slate-300 border-slate-700'}
                    description="Painel de monitoramento meteorológico ao vivo, 27 estações das capitais, radar ECMWF e índices oceânicos."
                  />
                </div>
              )}
            </div>
          )}

          {/* 2.C QUANDO EM MUSICALIDADES: [Hinos] [Top 5] [Nacional] + [Eras do Rádio] */}
          {mainMode === 'musicalidades' && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {/* Hinos */}
              <div className="relative group">
                <button
                  onClick={() => onSelectMusicCategory?.('state_anthems')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'state_anthems'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Hinos Oficiais"
                >
                  <BookOpen className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Hinos Oficiais do Estado"
                  badge="Hinos Cívicos"
                  description="Hino Oficial do Estado selecionado e o Hino da Capital Municipal com letras e execução orquestrada."
                />
              </div>

              {/* Top 5 */}
              <div className="relative group">
                <button
                  onClick={() => onSelectMusicCategory?.('top5')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'top5'
                      ? 'bg-orange-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Top 5 Clássicos"
                >
                  <Flame className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Top 5 Clássicos Regionais"
                  badge="Patrimônio Musical"
                  badgeColor="bg-orange-500/20 text-orange-300 border-orange-400/40"
                  description="As 5 canções e ritmos mais representativos da identidade do estado e seus grandes artistas."
                />
              </div>

              {/* Hinos Nacionais */}
              <div className="relative group">
                <button
                  onClick={() => onSelectMusicCategory?.('national')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeMusicCategory === 'national'
                      ? 'bg-yellow-500 text-slate-950 font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-label="Hinos Cívicos Nacionais"
                >
                  <Award className="w-4 h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Hinos Cívicos Nacionais"
                  badge="Brasil"
                  badgeColor="bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                  description="Grandes símbolos cívicos do Brasil: Hino à Bandeira, Independência, Proclamação e Canção do Expedicionário."
                />
              </div>

              {onToggleRadio && (
                <div className="relative group">
                  <button
                    onClick={onToggleRadio}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isRadioOpen
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-300'
                    }`}
                    aria-label="Abrir/Fechar Rádio"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                  </button>

                  <SpeechBubbleTooltip
                    title="Gabinete do Rádio Retrô"
                    badge={isRadioOpen ? 'Aberto' : 'Minimizado'}
                    description="Abre ou fecha o aparelho de rádio na tela (as eras históricas são controladas dentro do rádio)."
                  />
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
              <div className="relative group">
                <button
                  onClick={onToggleRainSim}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isRainSimActive
                      ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-md font-bold scale-105'
                      : 'text-cyan-400 hover:bg-cyan-950/60 hover:text-cyan-300'
                  }`}
                  aria-label="Simular Chuva"
                >
                  <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Simulador de Chuva"
                  badge={isRainSimActive ? 'Ativo' : 'Inativo'}
                  description="Simulação de partículas de chuva em 3D sobre o relevo do país."
                />
              </div>
            )}

            {/* Nuvens */}
            {onToggleClouds && (
              <div className="relative group">
                <button
                  onClick={onToggleClouds}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isCloudsActive
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Nuvens no Relevo"
                >
                  <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Nuvens Cumulus"
                  badge={isCloudsActive ? 'Visível' : 'Oculto'}
                  description="Camada de nuvens animadas que projetam sombras dinâmicas no mapa."
                />
              </div>
            )}

            {/* Ondas Oceânicas */}
            {onToggleWaves && (
              <div className="relative group">
                <button
                  onClick={onToggleWaves}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isWavesActive
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Ondas do Atlântico"
                >
                  <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Ondas do Oceano Atlântico"
                  badge={isWavesActive ? 'Visível' : 'Oculto'}
                  description="Dinâmica das correntes marinhas e espuma na costa litorânea de 7.491 km."
                />
              </div>
            )}

            {/* Gaivotas & Brisa */}
            {onToggleAtmosphere && (
              <div className="relative group">
                <button
                  onClick={onToggleAtmosphere}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    isAtmosphereActive
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Gaivotas e Atmosfera"
                >
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Luz Solar & Gaivotas"
                  badge={isAtmosphereActive ? 'Visível' : 'Oculto'}
                  description="Partículas de luz solar e aves sobrevoando o relevo."
                />
              </div>
            )}

            {/* Configurações Gerais */}
            {onOpenSettings && (
              <div className="relative group">
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenSettings();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 flex items-center justify-center transition cursor-pointer"
                  aria-label="Configurações"
                >
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <SpeechBubbleTooltip
                  title="Configurações"
                  description="Ajuste volume do áudio, efeitos sonoros e telemetria."
                  align="right"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUBMENU CENTRALIZADO E FIXO ACIMA DO RODAPÉ (Sem colidir com o rodapé) */}
      {/* ========================================================================= */}
      <div
        id="menu-secundario-rodape-dinamico"
        className="menu-secundario-rodape-dinamico fixed bottom-11 sm:bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-auto max-w-[96vw] select-none font-sans"
      >
        {/* 2.A NO MODO CLIMA: Régua ECMWF Interativa + Pílulas Engajadas (Máxima MT, Mínima RS, Média BR) */}
        {mainMode === 'clima' && (
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Régua ECMWF Interativa */}
            {climateMode === 'temperaturas_frentes' && (
              <div className="bg-slate-950/90 backdrop-blur-md border border-amber-500/30 rounded-lg px-2 py-0.5 shadow-xl flex items-center gap-1.5 text-white shrink-0">
                <span className="text-[9px] font-serif font-black text-amber-300 shrink-0 flex items-center gap-0.5">
                  <Thermometer className="w-2.5 h-2.5 text-amber-400" />
                  ECMWF
                </span>
                <div className="flex items-center gap-0.5">
                  {ECMWF_TEMP_COLOR_STOPS.map((stop) => (
                    <div
                      key={stop.temp}
                      style={{ backgroundColor: stop.hex }}
                      className="w-2.5 h-2.5 rounded-[2px] cursor-pointer hover:scale-125 transition-transform"
                      title={`${stop.temp}°C: ${stop.label}`}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-slate-400 shrink-0">
                  -4° a 36°C
                </span>
              </div>
            )}

            {/* ZCAS Chuvas Intensidade */}
            {climateMode === 'precipitacao_zcas' && (
              <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-lg px-2 py-0.5 shadow-xl flex items-center gap-1 text-white shrink-0">
                <CloudRain className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <div className="flex items-center gap-0.5 text-[8px] font-mono">
                  <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Fraca (&lt;5mm)</span>
                  <span className="px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">Mod (5-20mm)</span>
                  <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Forte (&gt;20mm)</span>
                </div>
              </div>
            )}

            {/* PÍLULA ENGAJADA 1: Calor Máximo (Clica e Navega para o MT) */}
            <div className="relative group shrink-0">
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onFocusState?.(maxTempState.stateId);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900/90 text-[9px] font-mono font-bold transition cursor-pointer shadow-md hover:scale-105"
              >
                <TrendingUp className="w-2.5 h-2.5 text-red-400" />
                <span>Máx: {maxTempState.stateId} {maxTempState.temp}°C</span>
              </button>

              <SpeechBubbleTooltip
                side="top"
                title={`Ponto Mais Quente: ${maxTempState.stateId}`}
                badge={`${maxTempState.temp}°C`}
                badgeColor="bg-red-500/20 text-red-300 border-red-400/40"
                description="Clique para focar a câmera no estado com a temperatura mais alta do país."
              />
            </div>

            {/* PÍLULA ENGAJADA 2: Frio Mínimo (Clica e Navega para o RS) */}
            <div className="relative group shrink-0">
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onFocusState?.(minTempState.stateId);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 hover:bg-blue-900/90 text-[9px] font-mono font-bold transition cursor-pointer shadow-md hover:scale-105"
              >
                <TrendingDown className="w-2.5 h-2.5 text-blue-400" />
                <span>Mín: {minTempState.stateId} {minTempState.temp}°C</span>
              </button>

              <SpeechBubbleTooltip
                side="top"
                title={`Ponto Mais Frio: ${minTempState.stateId}`}
                badge={`${minTempState.temp}°C`}
                badgeColor="bg-blue-500/20 text-blue-300 border-blue-400/40"
                description="Clique para focar a câmera no estado com a menor temperatura registrada."
              />
            </div>

            {/* PÍLULA ENGAJADA 3: Média Brasil */}
            <div className="relative group shrink-0">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-950/90 border border-amber-500/40 text-amber-300 text-[9px] font-mono font-bold shadow-md">
                <Gauge className="w-2.5 h-2.5 text-amber-400" />
                <span>Média BR: {avgTempBrazil}°C</span>
              </div>

              <SpeechBubbleTooltip
                side="top"
                title="Média Térmica Nacional"
                badge={`${avgTempBrazil}°C`}
                description="Temperatura média ponderada calculada em tempo real com base nas 27 capitais."
              />
            </div>
          </div>
        )}

        {/* 2.B NO MODO MUSICALIDADES: Pílula de Rádio Ativo */}
        {mainMode === 'musicalidades' && (
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative group shrink-0">
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onToggleRadio?.();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/95 border border-amber-500/60 text-amber-200 text-[10px] font-mono font-bold transition cursor-pointer shadow-2xl hover:bg-amber-900/90"
              >
                <Disc className={`w-3.5 h-3.5 text-amber-400 ${isRadioPlaying ? 'animate-spin' : ''}`} />
                <span className="text-amber-300">{selectedStateId}: {currentStationName}</span>
                <span className="text-amber-400/80 truncate max-w-[180px]">• {currentTrackTitle}</span>
              </button>

              <SpeechBubbleTooltip
                side="top"
                title={`Emissora Sintonizada: ${selectedStateId}`}
                badge={isRadioPlaying ? 'Tocando' : 'Pausado'}
                description="Clique nos estados no mapa para sintonizar a rádio do estado."
              />
            </div>
          </div>
        )}

        {/* 2.C NO MODO AVENTURA: Pílula de Progresso Cívico */}
        {mainMode === 'aventura' && (
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative group shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 text-[10px] font-mono font-bold shadow-2xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedStateCount}/27 Estados Explorados</span>
                <span className="text-emerald-400/80">• {unlockedInsigniaCount} Insígnias Sagradas</span>
              </div>

              <SpeechBubbleTooltip
                side="top"
                title="Progresso da Jornada"
                badge={`Nível ${playerLevel} • ${playerXp} XP`}
                description="Visite os estados no mapa e enfrente os desafios dos Guardiões."
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
