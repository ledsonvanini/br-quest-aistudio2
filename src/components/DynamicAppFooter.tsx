import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Activity } from 'lucide-react';
import { AppMainMode, GuardianData } from '../types';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { vintageRadioEngine, RadioPlaybackState } from '../lib/vintageRadioEngine';
import { getStateMusicalHeritage } from '../data/musicalHeritageData';
import { formatBrasiliaTimeDynamic } from '../services/climateService';
import { biodiversityService } from '../services/biodiversityService';
import { perfEngine, FpsTelemetry } from '../lib/performanceEngine';
import { GeopoliticaMetricKey } from '../types/geopolitica';
import { FooterWeatherTicker } from './footer/FooterWeatherTicker';
import { FooterBiodiversityTicker } from './footer/FooterBiodiversityTicker';
import { FooterRadioTicker } from './footer/FooterRadioTicker';
import { FooterGeopoliticsTicker } from './footer/FooterGeopoliticsTicker';
import { FooterAdventureTicker } from './footer/FooterAdventureTicker';
import { FooterGlobeTicker } from './footer/FooterGlobeTicker';
import { FooterTerritoryTicker } from './footer/FooterTerritoryTicker';
import { CartographyLayerMode } from '../types/cartography';

interface DynamicAppFooterProps {
  mainMode: AppMainMode;
  activeTab: 'map' | 'insignias';
  activeGuardian: GuardianData | null;
  completedStateIds: string[];
  unlockedInsigniaCount: number;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  onOpenAboutInfo: () => void;
  onNavigateHome: () => void;

  // Telemetry & Utility
  showFps?: boolean;
  onToggleFps?: () => void;
  onOpenApiStatus?: () => void;

  // Climate context
  climateMode?: ClimateMode;
  onOpenObservatorio?: () => void;
  isObservatorioOpen?: boolean;
  avgTempBrazil?: number;
  maxTempState?: { stateId: string; temp: number };
  minTempState?: { stateId: string; temp: number };
  climateLastUpdated?: string | number;

  // Music & Geopolitics
  onToggleRadio?: () => void;
  geopoliticaMetric?: GeopoliticaMetricKey;
  onOpenBrQuestHub?: () => void;

  // 3D Orbital context
  globeTextureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  isGlobeAutoRotateActive?: boolean;
  isGlobeCloudsActive?: boolean;
  onToggleGlobeAutoRotate?: () => void;
  onResetGlobeCamera?: () => void;

  // Cartography Layer context (2D)
  activeCartographyLayer?: CartographyLayerMode;
  onClearCartographyLayer?: () => void;
  onSelectCartographyLayer?: (layer: CartographyLayerMode) => void;
  selectedTerritorySubitemId?: string | null;
  onSelectTerritorySubitem?: (subitemId: string | null) => void;
  isTerritorySubmenuOpen?: boolean;
  onToggleTerritorySubmenu?: () => void;
}

export const DynamicAppFooter: React.FC<DynamicAppFooterProps> = ({
  mainMode,
  activeTab,
  activeGuardian,
  completedStateIds,
  unlockedInsigniaCount,
  hoveredStateId,
  selectedStateId,
  onStateClick,
  onNavigateHome,
  showFps = false,
  onToggleFps,
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  climateLastUpdated,
  onToggleRadio,
  geopoliticaMetric = 'miscigenacao',
  onOpenBrQuestHub,
  globeTextureMode = 'nasa_satellite',
  isGlobeAutoRotateActive = false,
  isGlobeCloudsActive = true,
  onToggleGlobeAutoRotate,
  onResetGlobeCamera,
  activeCartographyLayer = 'none',
  onClearCartographyLayer,
  onSelectCartographyLayer,
  selectedTerritorySubitemId,
  onSelectTerritorySubitem,
  isTerritorySubmenuOpen,
  onToggleTerritorySubmenu,
}) => {
  const completedSet = useMemo(() => new Set(completedStateIds), [completedStateIds]);
  const formattedTimeOnly = useMemo(() => {
    return formatBrasiliaTimeDynamic(climateLastUpdated);
  }, [climateLastUpdated]);
  const biodivTimeOnly = useMemo(() => biodiversityService.getBrasiliaTimeOnly(), []);

  const [radioState, setRadioState] = useState<RadioPlaybackState>(() => vintageRadioEngine.getState());
  const [fpsTelemetry, setFpsTelemetry] = useState<FpsTelemetry>({
    fps: 60,
    frametimeMs: 16.6,
    quality: 'optimal',
    activeParticles: 0,
  });

  useEffect(() => {
    const unsubRadio = vintageRadioEngine.subscribe(setRadioState);
    const unsubPerf = perfEngine.subscribe(setFpsTelemetry);
    return () => {
      unsubRadio();
      unsubPerf();
    };
  }, []);

  const activeMusicStateData = useMemo(() => {
    const stateId = radioState.activeStateId || selectedStateId || 'RJ';
    return getStateMusicalHeritage(stateId);
  }, [selectedStateId, radioState.activeStateId]);

  return (
    <footer
      id="rodape-aplicacao-dinamico"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="rodape-aplicacao container-rodape-dinamico fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#020d24]/92 backdrop-blur-md border border-amber-500/35 rounded-2xl px-2.5 sm:px-3.5 py-1.5 text-slate-200 select-none shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-center justify-center gap-2 sm:gap-3 pointer-events-auto max-w-[calc(100vw-24px)] md:max-w-fit transition-all duration-300 mx-auto"
      role="contentinfo"
      aria-label="Rodapé do Sistema BR Quest"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
        {/* Seção de Conteúdo Dinâmico Auxiliar Centralizado */}
        <div className="secao-conteudo-dinamico-auxiliar flex items-center justify-center overflow-visible">
          {/* CASO GLOBO 3D ORBITAL */}
          {mainMode === 'globo3d' && (
            <FooterGlobeTicker
              textureMode={globeTextureMode}
              isAutoRotate={isGlobeAutoRotateActive}
            />
          )}

          {/* CASO CAMADA CARTOGRÁFICA ATIVA (2D) */}
          {mainMode !== 'globo3d' && !activeGuardian && activeTab === 'map' && activeCartographyLayer !== 'none' && (
            <FooterTerritoryTicker
              activeLayer={activeCartographyLayer}
              selectedSubitemId={selectedTerritorySubitemId}
              onSelectSubitem={onSelectTerritorySubitem}
              onClearLayer={onClearCartographyLayer || (() => {})}
              onSelectLayer={onSelectCartographyLayer}
              isSubmenuOpen={isTerritorySubmenuOpen}
              onToggleSubmenu={onToggleTerritorySubmenu}
              onClearSelection={selectedStateId ? () => onStateClick(selectedStateId) : undefined}
            />
          )}

          {/* CASO A: Modo Aventura / Cartografia */}
          {mainMode !== 'globo3d' && activeCartographyLayer === 'none' && !activeGuardian && activeTab === 'map' && mainMode === 'aventura' && (
            <FooterAdventureTicker
              completedSet={completedSet}
              hoveredStateId={hoveredStateId}
              onStateClick={onStateClick}
              onOpenBrQuestHub={onOpenBrQuestHub}
            />
          )}

          {/* CASO B: Modo Clima no Mapa */}
          {mainMode !== 'globo3d' && activeCartographyLayer === 'none' && !activeGuardian && activeTab === 'map' && mainMode === 'clima' && (
            <FooterWeatherTicker
              avgTempBrazil={avgTempBrazil}
              maxTempState={maxTempState}
              minTempState={minTempState}
              formattedTimeOnly={formattedTimeOnly}
            />
          )}

          {/* CASO C: Modo Biodiversidade no Mapa */}
          {mainMode !== 'globo3d' && activeCartographyLayer === 'none' && !activeGuardian && activeTab === 'map' && mainMode === 'biodiversidade' && (
            <FooterBiodiversityTicker biodivTimeOnly={biodivTimeOnly} />
          )}

          {/* CASO D: Modo Musicalidades no Mapa */}
          {mainMode !== 'globo3d' && activeCartographyLayer === 'none' && !activeGuardian && activeTab === 'map' && mainMode === 'musicalidades' && (
            <FooterRadioTicker
              radioState={radioState}
              activeMusicStateData={activeMusicStateData}
              onToggleRadio={onToggleRadio}
            />
          )}

          {/* CASO E: Modo Geopolítica no Mapa */}
          {mainMode !== 'globo3d' && activeCartographyLayer === 'none' && !activeGuardian && activeTab === 'map' && mainMode === 'geopolitica' && (
            <FooterGeopoliticsTicker geopoliticaMetric={geopoliticaMetric} />
          )}

          {/* CASO F: Cena do Guardião do Estado Ativo */}
          {activeGuardian && (
            <div className="painel-contexto-guardiao-rodape flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-950/70 border border-amber-400/60 text-xs shadow-md animate-in fade-in duration-150">
              <span className="text-amber-300 font-mono font-bold">{activeGuardian.id}</span>
              <span className="text-slate-300 font-serif font-bold truncate">
                {activeGuardian.stateNamePt}
              </span>
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onNavigateHome();
                }}
                className="btn-voltar-mapa-rodape ml-1 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] font-serif hover:bg-amber-400 transition cursor-pointer"
              >
                Voltar ao Mapa
              </button>
            </div>
          )}

          {/* CASO G: Santuário das Insígnias */}
          {!activeGuardian && activeTab === 'insignias' && (
            <div className="painel-contexto-insignias-rodape flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-150">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-serif font-bold">
                Santuário das Insígnias
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                • {unlockedInsigniaCount}/27
              </span>
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onNavigateHome();
                }}
                className="btn-voltar-mapa-rodape ml-1 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] font-serif hover:bg-amber-400 transition cursor-pointer"
              >
                Explorar Mapa
              </button>
            </div>
          )}
        </div>

        {/* Telemetria Compacta (FPS Ativo se Habilitado) */}
        {showFps && onToggleFps && (
          <div
            id="secao-controles-fixos-direita-rodape"
            className="secao-direita-rodape flex items-center gap-1 shrink-0"
          >
            <button
              id="btn-fps-rodape"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleFps();
              }}
              className={`btn-fps-rodape flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold transition shadow-md cursor-pointer ${
                fpsTelemetry.quality === 'optimal'
                  ? 'bg-emerald-950/90 border-emerald-400/80 text-emerald-300'
                  : fpsTelemetry.quality === 'good'
                  ? 'bg-amber-950/90 border-amber-400/80 text-amber-300'
                  : 'bg-rose-950/90 border-rose-400/80 text-rose-300'
              }`}
              title={`Taxa: ${fpsTelemetry.fps} FPS (${fpsTelemetry.frametimeMs}ms). Clique para ocultar.`}
              aria-label={`FPS: ${fpsTelemetry.fps}`}
            >
              <Activity className="w-3 h-3 animate-pulse shrink-0" />
              <span>{fpsTelemetry.fps} FPS</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
