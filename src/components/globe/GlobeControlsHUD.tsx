/**
 * GlobeControlsHUD - Barra de Ferramentas e HUD de Controles do Modo Globo 3D
 * Orquestra menus popover (Astros, Câmeras, Camadas, Cosmos, Estações, Sol e Texturas)
 * com política estrita de exclusividade mútua: apenas um menu ou painel aberto por vez.
 */
import React, { useState, useEffect, useRef } from 'react';
import { GlobeSeason, GlobeTextureMode } from '../../lib/globeEngine';
import { useBrasiliaTime } from '../../hooks/useBrasiliaTime';
import { GlobeAstroSelectorMenu, AstroOption, CELESTIAL_ASTROS_LIST } from './GlobeAstroSelectorMenu';
import { GlobeCameraMenu, CameraPresetOption } from './GlobeCameraMenu';
import { GlobeTerritoryLayersMenu } from './GlobeTerritoryLayersMenu';
import { BorderRegionFilter } from '../../lib/globeEngine/brazilGeoMeshBuilder';
import { GlobeCosmosAtmosphereMenu } from './GlobeCosmosAtmosphereMenu';
import { GlobeSeasonSelectorMenu } from './GlobeSeasonSelectorMenu';
import { GlobeSolarQuickMenu } from './GlobeSolarQuickMenu';
import { GlobeTextureSelectorMenu } from './GlobeTextureSelectorMenu';
import { GlobeQuickActionButtons } from './GlobeQuickActionButtons';

export { CELESTIAL_ASTROS_LIST };
export type { AstroOption, BorderRegionFilter };

interface GlobeControlsHUDProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  cloudsEnabled: boolean;
  onToggleClouds: () => void;
  showSolarSystem: boolean;
  onToggleSolarSystem: () => void;
  showGeodesicRoutes: boolean;
  onToggleGeodesicRoutes: () => void;
  textureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  season: GlobeSeason;
  onChangeSeason: (season: GlobeSeason) => void;
  showBorders: boolean;
  onToggleBorders: () => void;
  borderRegionFilter?: BorderRegionFilter;
  onChangeBorderRegionFilter?: (region: BorderRegionFilter) => void;
  pinDisplayMode?: 'all' | 'compact' | 'none';
  onTogglePinDisplayMode?: () => void;
  isTelemetryOpen?: boolean;
  onToggleTelemetry?: () => void;
  isTextureInfoOpen?: boolean;
  onToggleTextureInfoPanel?: () => void;
  selectedAstroId?: string | null;
  onNavigateToAstro?: (astroId: string) => void;
  solarHour?: number | null;
  onChangeSolarHour?: (hour: number | null) => void;
  isSolarCyclePlaying?: boolean;
  onToggleSolarCycle?: () => void;
  currentSolarStatus?: 'dia' | 'crepusculo' | 'noite';
  ambientLightIntensity?: number;
  onChangeAmbientLightIntensity?: (intensity: number) => void;
  moonLightIntensity?: number;
  onChangeMoonLightIntensity?: (intensity: number) => void;
  isSolarSimulatorOpen?: boolean;
  onToggleSolarSimulator?: () => void;
  activeScenePresetId?: string;
  onSelectScenePreset?: (presetId: string) => void;
  onCloseAllPanels?: () => void;
}

type ActiveHudMenu =
  | 'none'
  | 'astro'
  | 'camera'
  | 'cosmos'
  | 'layers'
  | 'season'
  | 'solar'
  | 'texture';

export const GlobeControlsHUD: React.FC<GlobeControlsHUDProps> = ({
  autoRotate,
  onToggleAutoRotate,
  cloudsEnabled,
  onToggleClouds,
  showSolarSystem,
  onToggleSolarSystem,
  showGeodesicRoutes,
  onToggleGeodesicRoutes,
  textureMode,
  onChangeTextureMode,
  season,
  onChangeSeason,
  showBorders,
  onToggleBorders,
  borderRegionFilter = 'all',
  onChangeBorderRegionFilter,
  pinDisplayMode = 'all',
  onTogglePinDisplayMode,
  isTelemetryOpen,
  onToggleTelemetry,
  isTextureInfoOpen,
  onToggleTextureInfoPanel,
  selectedAstroId = 'terra',
  onNavigateToAstro,
  solarHour = null,
  onChangeSolarHour,
  isSolarCyclePlaying = false,
  onToggleSolarCycle,
  currentSolarStatus = 'dia',
  ambientLightIntensity = 0.14,
  onChangeAmbientLightIntensity,
  moonLightIntensity = 0.65,
  onChangeMoonLightIntensity,
  isSolarSimulatorOpen = false,
  onToggleSolarSimulator,
  activeScenePresetId = 'foco-brasil',
  onSelectScenePreset,
  onCloseAllPanels,
}) => {
  const [activeMenu, setActiveMenu] = useState<ActiveHudMenu>('none');
  const hudRef = useRef<HTMLDivElement>(null);
  const brasiliaTime = useBrasiliaTime();

  // Fecha qualquer menu interno quando um grande painel for aberto externamente
  useEffect(() => {
    if (isSolarSimulatorOpen || isTelemetryOpen || isTextureInfoOpen) {
      setActiveMenu('none');
    }
  }, [isSolarSimulatorOpen, isTelemetryOpen, isTextureInfoOpen]);

  // Click outside fecha qualquer popover ativo
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hudRef.current && !hudRef.current.contains(e.target as Node)) {
        setActiveMenu('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = (menuName: ActiveHudMenu) => {
    const willOpen = activeMenu !== menuName;
    if (willOpen) {
      // Exclusividade estrita: fechar grandes painéis ao abrir um popover da barra
      if (onCloseAllPanels) {
        onCloseAllPanels();
      } else {
        if (isSolarSimulatorOpen && onToggleSolarSimulator) onToggleSolarSimulator();
        if (isTelemetryOpen && onToggleTelemetry) onToggleTelemetry();
        if (isTextureInfoOpen && onToggleTextureInfoPanel) onToggleTextureInfoPanel();
      }
      setActiveMenu(menuName);
    } else {
      setActiveMenu('none');
    }
  };

  const handleOpenLargePanel = (toggleFn?: () => void) => {
    setActiveMenu('none');
    if (toggleFn) toggleFn();
  };

  return (
    <div
      ref={hudRef}
      id="container-toolbar-globo-3d"
      className="container-toolbar-globo-3d painel-hud-controles fixed sm:absolute bottom-3 sm:bottom-4 left-[56px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-slate-950/92 backdrop-blur-md rounded-2xl border border-slate-700/70 p-1.5 shadow-2xl flex items-center gap-1.5 overflow-visible max-w-[calc(100vw-68px)] sm:max-w-max pointer-events-auto select-none"
      role="toolbar"
      aria-label="Controles Interativos do Globo 3D"
    >
      {/* 1. Seletor de Astros & Navegação Interplanetária */}
      <GlobeAstroSelectorMenu
        isOpen={activeMenu === 'astro'}
        onToggle={() => handleToggleMenu('astro')}
        selectedAstroId={selectedAstroId || 'terra'}
        onSelectAstro={(astroId) => onNavigateToAstro?.(astroId)}
      />

      <div className="h-5 w-px bg-slate-800 shrink-0" />

      {/* 2. Câmeras & Visões Astronômicas */}
      <GlobeCameraMenu
        isOpen={activeMenu === 'camera'}
        onToggle={() => handleToggleMenu('camera')}
        onClose={() => setActiveMenu('none')}
        activePresetId={activeScenePresetId}
        onSelectPreset={(presetId) => onSelectScenePreset?.(presetId)}
      />

      {/* 3. Camadas do Território Brasileiro */}
      <GlobeTerritoryLayersMenu
        isOpen={activeMenu === 'layers'}
        onToggle={() => handleToggleMenu('layers')}
        onClose={() => setActiveMenu('none')}
        showGeodesicRoutes={showGeodesicRoutes}
        onToggleGeodesicRoutes={onToggleGeodesicRoutes}
        showBorders={showBorders}
        onToggleBorders={onToggleBorders}
        pinDisplayMode={pinDisplayMode}
        onTogglePinDisplayMode={onTogglePinDisplayMode}
        borderRegionFilter={borderRegionFilter}
        onChangeBorderRegionFilter={onChangeBorderRegionFilter}
      />

      {/* 4. Cosmos, Atmosfera & Órbitas */}
      <GlobeCosmosAtmosphereMenu
        isOpen={activeMenu === 'cosmos'}
        onToggle={() => handleToggleMenu('cosmos')}
        onClose={() => setActiveMenu('none')}
        showSolarSystem={showSolarSystem}
        onToggleSolarSystem={onToggleSolarSystem}
        cloudsEnabled={cloudsEnabled}
        onToggleClouds={onToggleClouds}
        autoRotate={autoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
      />

      <div className="h-5 w-px bg-slate-800 shrink-0" />

      {/* 5. Estações do Ano & Inclinação Axial */}
      <GlobeSeasonSelectorMenu
        isOpen={activeMenu === 'season'}
        onToggle={() => handleToggleMenu('season')}
        currentSeason={season}
        onChangeSeason={onChangeSeason}
      />

      {/* 6. Iluminação Rápida & Ciclo Solar */}
      <GlobeSolarQuickMenu
        isOpen={activeMenu === 'solar'}
        onToggle={() => handleToggleMenu('solar')}
        solarHour={solarHour}
        onChangeSolarHour={(h) => onChangeSolarHour?.(h)}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={() => onToggleSolarCycle?.()}
        solarCycleSpeed={1}
        onChangeSolarCycleSpeed={() => {}}
        sunIntensity={1.0}
        onChangeSunIntensity={() => {}}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={(i) => onChangeAmbientLightIntensity?.(i)}
        cloudsOpacity={0.4}
        onChangeCloudsOpacity={() => {}}
        cityLightIntensity={1.0}
        onChangeCityLightIntensity={() => {}}
        onResetDefaults={() => onChangeSolarHour?.(null)}
        brasiliaTimeFormatted={brasiliaTime.formattedTime}
      />

      {/* 7. Mosaicos de Texturas Globais */}
      <GlobeTextureSelectorMenu
        isOpen={activeMenu === 'texture'}
        onToggle={() => handleToggleMenu('texture')}
        textureMode={textureMode}
        onChangeTextureMode={onChangeTextureMode}
        onOpenTextureInfo={() => handleOpenLargePanel(onToggleTextureInfoPanel)}
      />

      <div className="h-5 w-px bg-slate-800 shrink-0" />

      {/* 8. Botões Destaque: Simulador Solar & Telemetria */}
      <GlobeQuickActionButtons
        isSolarSimulatorOpen={isSolarSimulatorOpen}
        onToggleSolarSimulator={onToggleSolarSimulator}
        isTelemetryOpen={isTelemetryOpen}
        onToggleTelemetry={onToggleTelemetry}
        onActionClick={handleOpenLargePanel}
      />
    </div>
  );
};
