import React, { useState, useRef, useEffect } from 'react';
import {
  MapVisualStyle,
  ChoroplethSubTheme,
} from '../../lib/mapColorScales';
import { TerrainTileProvider } from './ClippedMapTilesLayer';
import {
  Mountain,
  Map as MapIcon,
  Scroll,
  Globe,
  Palette,
  Eye,
  Wind,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MapControlsHUDProps {
  visualStyle: MapVisualStyle;
  onVisualStyleChange: (style: MapVisualStyle) => void;
  terrainProvider: TerrainTileProvider;
  onTerrainProviderChange: (provider: TerrainTileProvider) => void;
  choroplethSubTheme: ChoroplethSubTheme;
  onChoroplethSubThemeChange: (theme: ChoroplethSubTheme) => void;
  is3D: boolean;
  onToggle3D: () => void;
  isGlobe3DActive: boolean;
  onToggleGlobe3D: () => void;
  atmosphereEnabled: boolean;
  onToggleAtmosphere: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

type MenuCategory = 'styles' | 'projection' | 'navigation' | 'ambience' | null;

export const MapControlsHUD: React.FC<MapControlsHUDProps> = ({
  visualStyle,
  onVisualStyleChange,
  terrainProvider,
  onTerrainProviderChange,
  choroplethSubTheme,
  onChoroplethSubThemeChange,
  is3D,
  onToggle3D,
  isGlobe3DActive,
  onToggleGlobe3D,
  atmosphereEnabled,
  onToggleAtmosphere,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [activeHoverMenu, setActiveHoverMenu] = useState<MenuCategory>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterMenu = (menu: MenuCategory) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveHoverMenu(menu);
  };

  const handleMouseLeaveMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // 400ms buffer allows smooth mouse travel between icon and expanded drawer
    closeTimeoutRef.current = setTimeout(() => {
      setActiveHoverMenu(null);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="painel-hud-controles painel-toolbar-relevo fixed top-24 left-5 z-40 flex flex-col gap-2 pointer-events-none">
      
      {/* ==================================================================== */}
      {/* 1. CATEGORIA: ESTILOS & TEXTURAS DO MAPA                             */}
      {/* ==================================================================== */}
      <div
        className="grupo-hover-estilos relative flex items-center pointer-events-auto"
        onMouseEnter={() => handleMouseEnterMenu('styles')}
        onMouseLeave={handleMouseLeaveMenu}
      >
        <button
          id="hud-btn-stack-styles"
          onClick={() => setActiveHoverMenu((prev) => (prev === 'styles' ? null : 'styles'))}
          className={`btn-icone-pilha-estilos w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-200 cursor-pointer ${
            activeHoverMenu === 'styles'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 scale-105'
              : visualStyle === 'tiles'
              ? 'bg-slate-950/95 text-amber-400 border-amber-500/50 hover:bg-slate-900'
              : 'bg-slate-950/90 text-amber-200/80 border-amber-500/30 hover:bg-slate-900 hover:text-amber-300'
          }`}
          title="Estilos de Textura e Coropletia (Passe o mouse para abrir)"
        >
          <Layers className="w-4.5 h-4.5" />
        </button>

        {/* Horizontal Drawer: Map Styles */}
        <div
          className={`drawer-horizontal-estilos absolute left-full ml-2.5 top-0 flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl shadow-black/90 transition-all duration-250 ease-out origin-left z-20 ${
            activeHoverMenu === 'styles'
              ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-x-3 scale-95 pointer-events-none'
          }`}
        >
          {/* Main Visual Category Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-amber-500/30">
            <button
              id="hud-btn-mode-relief"
              onClick={() => onVisualStyleChange('tiles')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap ${
                visualStyle === 'tiles'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-amber-200/70 hover:text-amber-200'
              }`}
              title="Modo Texturas: Relevo topográfico, Satélite HD e Atlas"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Relevo & Satélite</span>
            </button>

            <button
              id="hud-btn-mode-choropleth"
              onClick={() => onVisualStyleChange('choropleth')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap ${
                visualStyle === 'choropleth'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-amber-200/70 hover:text-amber-200'
              }`}
              title="Modo Coroplético: Divisão temática por Regiões, Biomas ou XP"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Coroplético</span>
            </button>
          </div>

          {/* Sub-options for Relief / Tiles */}
          {visualStyle === 'tiles' ? (
            <div className="flex items-center gap-1 pl-2 border-l border-amber-500/30">
              <button
                id="hud-btn-sub-shaded"
                onClick={() => onTerrainProviderChange('shaded_relief')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  terrainProvider === 'shaded_relief'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Sombreamento topográfico digital com montanhas e platôs"
              >
                <Mountain className="w-3 h-3" />
                <span>Relevo</span>
              </button>

              <button
                id="hud-btn-sub-satellite"
                onClick={() => onTerrainProviderChange('satellite_earth')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  terrainProvider === 'satellite_earth'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Imagens orbitais reais de alta resolução"
              >
                <Globe className="w-3 h-3" />
                <span>Satélite</span>
              </button>

              <button
                id="hud-btn-sub-physical"
                onClick={() => onTerrainProviderChange('physical_atlas')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  terrainProvider === 'physical_atlas'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Vegetação, florestas e bacias hidrográficas"
              >
                <MapIcon className="w-3 h-3" />
                <span>Atlas</span>
              </button>

              <button
                id="hud-btn-sub-voyager"
                onClick={() => onTerrainProviderChange('voyager_parchment')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  terrainProvider === 'voyager_parchment'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Estilo cartográfico clássico de pergaminho antigo"
              >
                <Scroll className="w-3 h-3" />
                <span>Pergaminho</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 pl-2 border-l border-amber-500/30">
              <button
                id="hud-btn-sub-regions"
                onClick={() => onChoroplethSubThemeChange('regions')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  choroplethSubTheme === 'regions'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Coloração pelas 5 Macrorregiões do IBGE (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)"
              >
                Regiões
              </button>

              <button
                id="hud-btn-sub-biomes"
                onClick={() => onChoroplethSubThemeChange('biomes')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  choroplethSubTheme === 'biomes'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Coloração pelos 6 Biomas Naturais do Brasil"
              >
                Biomas
              </button>

              <button
                id="hud-btn-sub-progress"
                onClick={() => onChoroplethSubThemeChange('progress')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-serif font-bold transition-all whitespace-nowrap border ${
                  choroplethSubTheme === 'progress'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
                }`}
                title="Coloração pelo nível de progresso e XP conquistado em cada estado"
              >
                XP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. CATEGORIA: PROJEÇÃO & CÂMERA (2D / 3D / GLOBO)                    */}
      {/* ==================================================================== */}
      <div
        className="grupo-hover-projecao relative flex items-center pointer-events-auto"
        onMouseEnter={() => handleMouseEnterMenu('projection')}
        onMouseLeave={handleMouseLeaveMenu}
      >
        <button
          id="hud-btn-stack-projection"
          onClick={() => setActiveHoverMenu((prev) => (prev === 'projection' ? null : 'projection'))}
          className={`btn-icone-pilha-projecao w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-200 cursor-pointer ${
            activeHoverMenu === 'projection' || isGlobe3DActive || is3D
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 scale-105'
              : 'bg-slate-950/90 text-amber-200/80 border-amber-500/30 hover:bg-slate-900 hover:text-amber-300'
          }`}
          title="Modos de Projeção: Plano 2D, Inclinação 3D e Globo 3D"
        >
          <Compass className={`w-4.5 h-4.5 transition-transform duration-300 ${is3D ? 'rotate-45' : 'rotate-0'}`} />
        </button>

        {/* Horizontal Drawer: Projections */}
        <div
          className={`drawer-horizontal-projecao absolute left-full ml-2.5 top-0 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl shadow-black/90 transition-all duration-250 ease-out origin-left z-20 ${
            activeHoverMenu === 'projection'
              ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-x-3 scale-95 pointer-events-none'
          }`}
        >
          {/* 3D Tilt Angle / 2D Flat Toggle */}
          {!isGlobe3DActive && (
            <button
              id="hud-btn-toggle-3d-flat"
              onClick={onToggle3D}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all border whitespace-nowrap ${
                is3D
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
              }`}
              title={is3D ? 'Alternar para perspectiva plana zenital 2D' : 'Alternar para perspectiva isométrica com relevo 3D'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{is3D ? 'Inclinação 3D' : 'Plano 2D'}</span>
            </button>
          )}

          {/* Globe 3D Toggle */}
          <button
            id="hud-btn-toggle-globe-3d"
            onClick={onToggleGlobe3D}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all border whitespace-nowrap ${
              isGlobe3DActive
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
            }`}
            title="Alternar entre o mapa aberto e o Globo Terrestre Interativo 3D"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Globo 3D</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. CATEGORIA: NAVEGAÇÃO & ZOOM (ZOOM +, -, CENTRALIZAR)              */}
      {/* ==================================================================== */}
      <div
        className="grupo-hover-navegacao relative flex items-center pointer-events-auto"
        onMouseEnter={() => handleMouseEnterMenu('navigation')}
        onMouseLeave={handleMouseLeaveMenu}
      >
        <button
          id="hud-btn-stack-nav"
          onClick={() => setActiveHoverMenu((prev) => (prev === 'navigation' ? null : 'navigation'))}
          className={`btn-icone-pilha-navegacao w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-200 cursor-pointer ${
            activeHoverMenu === 'navigation'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 scale-105'
              : 'bg-slate-950/90 text-amber-200/80 border-amber-500/30 hover:bg-slate-900 hover:text-amber-300'
          }`}
          title="Controles de Navegação e Zoom do Mapa"
        >
          <ZoomIn className="w-4.5 h-4.5" />
        </button>

        {/* Horizontal Drawer: Navigation & Zoom */}
        <div
          className={`drawer-horizontal-navegacao absolute left-full ml-2.5 top-0 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl shadow-black/90 transition-all duration-250 ease-out origin-left z-20 ${
            activeHoverMenu === 'navigation'
              ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-x-3 scale-95 pointer-events-none'
          }`}
        >
          {/* Zoom In */}
          <button
            id="hud-btn-camera-zoom-in"
            onClick={onZoomIn}
            className="p-2 rounded-lg bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800 hover:border-amber-400 transition-colors"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Readout */}
          <span className="text-xs font-mono text-amber-300 font-bold px-1.5 select-none whitespace-nowrap">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom Out */}
          <button
            id="hud-btn-camera-zoom-out"
            onClick={onZoomOut}
            className="p-2 rounded-lg bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800 hover:border-amber-400 transition-colors"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-amber-500/30 mx-0.5" />

          {/* Center Brazil Button */}
          <button
            id="hud-btn-camera-reset"
            onClick={onResetView}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800 hover:border-amber-400 transition-colors flex items-center gap-1.5 text-xs font-serif font-bold"
            title="Centralizar o mapa do Brasil na tela"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Centralizar</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. CATEGORIA: AMBIENTE & ÁUDIO (MÚSICA, ONDAS, GAIVOTAS)             */}
      {/* ==================================================================== */}
      <div
        className="grupo-hover-ambiente relative flex items-center pointer-events-auto"
        onMouseEnter={() => handleMouseEnterMenu('ambience')}
        onMouseLeave={handleMouseLeaveMenu}
      >
        <button
          id="hud-btn-stack-ambience"
          onClick={() => setActiveHoverMenu((prev) => (prev === 'ambience' ? null : 'ambience'))}
          className={`btn-icone-pilha-ambiente w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-200 cursor-pointer ${
            activeHoverMenu === 'ambience'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 scale-105'
              : 'bg-slate-950/90 text-amber-200/80 border-amber-500/30 hover:bg-slate-900 hover:text-amber-300'
          }`}
          title="Trilha Sonora e Efeitos Atmosféricos"
        >
          <Sparkles className="w-4.5 h-4.5" />
        </button>

        {/* Horizontal Drawer: Ambience & Sound */}
        <div
          className={`drawer-horizontal-ambiente absolute left-full ml-2.5 top-0 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl shadow-black/90 transition-all duration-250 ease-out origin-left z-20 ${
            activeHoverMenu === 'ambience'
              ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-x-3 scale-95 pointer-events-none'
          }`}
        >
          {/* Music Toggle */}
          {onToggleMusic && (
            <button
              id="hud-btn-toggle-rpg-music"
              onClick={onToggleMusic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all border whitespace-nowrap ${
                isMusicPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
              }`}
              title="Ativar ou pausar a trilha sonora orquestral do RPG"
            >
              {isMusicPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Música</span>
            </button>
          )}

          {/* Atmosphere FX (Fog & Seagulls) */}
          <button
            id="hud-btn-toggle-atmo-fx"
            onClick={onToggleAtmosphere}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all border whitespace-nowrap ${
              atmosphereEnabled
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-slate-900 text-amber-200/80 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
            }`}
            title="Ativar ou desativar o voo de gaivotas oceânicas e a névoa cartográfica"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Pássaros</span>
          </button>
        </div>
      </div>

    </div>
  );
};
