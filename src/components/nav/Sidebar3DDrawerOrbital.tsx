import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Cloud,
  RotateCw,
  Crosshair,
  Satellite,
  Activity,
  Layers,
} from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export interface Sidebar3DDrawerOrbitalProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  globeTextureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  onGlobeTextureModeChange?: (mode: 'nasa_satellite' | 'night_lights' | 'natural_earth') => void;
  isGlobeCloudsActive?: boolean;
  onToggleGlobeClouds?: () => void;
  isGlobeAutoRotateActive?: boolean;
  onToggleGlobeAutoRotate?: () => void;
  isGlobeBordersActive?: boolean;
  onToggleGlobeBorders?: () => void;
  isGlobeTelemetryOpen?: boolean;
  onToggleGlobeTelemetry?: () => void;
  onResetGlobeCamera?: () => void;
  bindTooltip: (config: {
    title: string;
    badge?: string;
    badgeColor?: string;
    description: string;
  }) => Record<string, unknown>;
}

/**
 * Sidebar3DDrawerOrbital
 * Gaveta de Controles Exclusivos do Modo Globo 3D Orbital.
 * Reúne ferramentas de textura, atmosfera, rotação planetária e foco no Brasil com acesso tátil direto.
 */
export const Sidebar3DDrawerOrbital: React.FC<Sidebar3DDrawerOrbitalProps> = ({
  isExpanded,
  onToggleExpand,
  globeTextureMode = 'nasa_satellite',
  onGlobeTextureModeChange,
  isGlobeCloudsActive = true,
  onToggleGlobeClouds,
  isGlobeAutoRotateActive = true,
  onToggleGlobeAutoRotate,
  isGlobeBordersActive = true,
  onToggleGlobeBorders,
  isGlobeTelemetryOpen = false,
  onToggleGlobeTelemetry,
  onResetGlobeCamera,
  bindTooltip,
}) => {
  const cycleTextureMode = () => {
    audioEngine.playSfx('click');
    if (!onGlobeTextureModeChange) return;
    if (globeTextureMode === 'nasa_satellite') {
      onGlobeTextureModeChange('night_lights');
    } else if (globeTextureMode === 'night_lights') {
      onGlobeTextureModeChange('natural_earth');
    } else {
      onGlobeTextureModeChange('nasa_satellite');
    }
  };

  const getTextureLabel = () => {
    switch (globeTextureMode) {
      case 'night_lights':
        return 'Luzes Noturnas';
      case 'natural_earth':
        return 'Natural Earth';
      case 'nasa_satellite':
      default:
        return 'Satélite NASA';
    }
  };

  return (
    <div
      id="secao-gaveta-orbital-3d"
      className="secao-gaveta-orbital-3d flex flex-col items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-indigo-500/35 shrink-0 shadow-lg transition-all duration-300"
    >
      {/* Botão Seta Retrátil (Chevron) */}
      <button
        id="btn-toggle-expansao-orbital-3d"
        type="button"
        onClick={() => {
          audioEngine.playSfx('click');
          onToggleExpand();
        }}
        {...bindTooltip({
          title: 'Cockpit Orbital 3D',
          badge: isExpanded ? 'Recolher' : 'Expandir',
          badgeColor: isExpanded
            ? 'bg-slate-700/50 text-slate-300 border-slate-600'
            : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
          description: isExpanded
            ? 'Clique para recolher os controles orbitais do planeta Terra.'
            : 'Clique para expandir controles 3D: Textura da Terra, Nuvens, Rotação, Foco no Brasil e Telemetria.',
        })}
        className="btn-toggle-expansao-orbital-3d w-9 h-6 sm:w-10 sm:h-6 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        aria-label={isExpanded ? 'Recolher Controles Orbitais' : 'Expandir Controles Orbitais'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-300 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-indigo-300 animate-pulse transition-transform" />
        )}
      </button>

      {/* Conteúdo Expansível: Ferramentas Orbitais */}
      {isExpanded && (
        <div className="flex flex-col items-center gap-1 transition-all duration-200">
          {/* 1. Ciclar Textura Planetária */}
          <button
            id="btn-globo-textura"
            type="button"
            onClick={cycleTextureMode}
            {...bindTooltip({
              title: `Textura: ${getTextureLabel()}`,
              badge: '3D Texture',
              badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
              description: 'Alterna entre NASA Blue Marble, Luzes Noturnas e Natural Earth.',
            })}
            className="btn-globo-textura relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md group"
            aria-label={`Alternar Textura do Globo: Atual ${getTextureLabel()}`}
          >
            <Satellite className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* 2. Travar / Focar Câmera no Brasil */}
          {onResetGlobeCamera && (
            <button
              id="btn-globo-foco-brasil"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onResetGlobeCamera();
              }}
              {...bindTooltip({
                title: 'Focar no Brasil',
                badge: 'Câmera Orbital',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                description: 'Recentraliza a câmera orbital com foco no território brasileiro.',
              })}
              className="btn-globo-foco-brasil relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md group"
              aria-label="Recentralizar Câmera no Brasil"
            >
              <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* 3. Auto-Rotação Planetária (Play / Pause) */}
          {onToggleGlobeAutoRotate && (
            <button
              id="btn-globo-girar"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleGlobeAutoRotate();
              }}
              {...bindTooltip({
                title: 'Rotação Planetária',
                badge: isGlobeAutoRotateActive ? 'Girando' : 'Pausado',
                badgeColor: isGlobeAutoRotateActive ? 'bg-blue-500/20 text-blue-300 border-blue-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                description: 'Inicia ou pausa a rotação suave do planeta Terra ao redor do eixo polar.',
              })}
              className={`btn-globo-girar relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isGlobeAutoRotateActive ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-blue-300 hover:bg-slate-800'
              }`}
              aria-label="Alternar Rotação do Globo"
            >
              <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isGlobeAutoRotateActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
          )}

          {/* 4. Nuvens Atmosféricas 3D */}
          {onToggleGlobeClouds && (
            <button
              id="btn-globo-nuvens"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleGlobeClouds();
              }}
              {...bindTooltip({
                title: 'Atmosfera & Nuvens 3D',
                badge: isGlobeCloudsActive ? 'Ativo' : 'Oculto',
                badgeColor: isGlobeCloudsActive ? 'bg-sky-500/20 text-sky-300 border-sky-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                description: 'Renderiza a camada atmosférica de nuvens volumétricas realistas em órbita.',
              })}
              className={`btn-globo-nuvens relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isGlobeCloudsActive ? 'bg-sky-500/30 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.5)]' : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-sky-300 hover:bg-slate-800'
              }`}
              aria-label="Alternar Nuvens 3D"
            >
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* 5. Fronteiras Estaduais */}
          {onToggleGlobeBorders && (
            <button
              id="btn-globo-fronteiras"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleGlobeBorders();
              }}
              {...bindTooltip({
                title: 'Fronteiras das 27 UFs',
                badge: isGlobeBordersActive ? 'Visível' : 'Oculto',
                badgeColor: isGlobeBordersActive ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                description: 'Exibe o traçado das divisas estaduais dos 26 estados e DF na esfera.',
              })}
              className={`btn-globo-fronteiras relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isGlobeBordersActive ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
              aria-label="Alternar Fronteiras dos Estados no Globo"
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* 6. Telemetria Orbital */}
          {onToggleGlobeTelemetry && (
            <button
              id="btn-globo-telemetria"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleGlobeTelemetry();
              }}
              {...bindTooltip({
                title: 'Telemetria Orbital',
                badge: isGlobeTelemetryOpen ? 'Aberto' : 'Fechado',
                badgeColor: isGlobeTelemetryOpen ? 'bg-teal-500/20 text-teal-300 border-teal-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                description: 'Abre o painel de telemetria orbital com altitude, velocidade e dados solares.',
              })}
              className={`btn-globo-telemetria relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isGlobeTelemetryOpen ? 'bg-teal-500/30 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.5)]' : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-teal-300 hover:bg-slate-800'
              }`}
              aria-label="Alternar Telemetria Orbital"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
