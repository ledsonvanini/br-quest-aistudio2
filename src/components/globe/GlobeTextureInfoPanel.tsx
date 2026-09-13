/**
 * GlobeTextureInfoPanel - Painel Discreto de Inteligência Cartográfica & Mosaicos da Terra
 * Explica dados ambientais, iluminação solar diurna/noturna, anomalias SST (El Niño), hidrologia e relevo.
 */
import React, { useState } from 'react';
import { GlobeTextureMode } from '../../lib/globeEngine/types';
import {
  ChevronDown,
  ChevronUp,
  X,
  Satellite,
  Compass,
  Info,
} from 'lucide-react';
import {
  TEXTURE_INFO_CATALOG,
  TextureMetadata,
} from '../../data/globeTextureCatalog';

export type { TextureMetadata };

interface GlobeTextureInfoPanelProps {
  textureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  onClose?: () => void;
}

export const GlobeTextureInfoPanel: React.FC<GlobeTextureInfoPanelProps> = ({
  textureMode,
  onChangeTextureMode,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const info = TEXTURE_INFO_CATALOG[textureMode] || TEXTURE_INFO_CATALOG.nasa_satellite;

  return (
    <div
      id="painel-info-texturas-globo"
      className="painel-info-texturas-globo absolute top-14 right-4 z-40 w-84 sm:w-92 max-w-[calc(100vw-68px)] max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 rounded-2xl bg-slate-950/95 border border-sky-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 text-slate-200 select-none pointer-events-auto"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-slate-900/60 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300">
            {info.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-sky-200 tracking-wide flex items-center gap-1.5">
              <span>Mosaicos da Terra</span>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-950/70 px-1 py-0.2 rounded border border-amber-800/60">
                NASA/ESA
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">
              {info.agency}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Fechar painel explicativo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Mode Carousel Selector */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-950/60 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {(Object.keys(TEXTURE_INFO_CATALOG) as GlobeTextureMode[]).map((modeKey) => {
          const item = TEXTURE_INFO_CATALOG[modeKey];
          const isActive = textureMode === modeKey;
          return (
            <button
              key={modeKey}
              type="button"
              onClick={() => onChangeTextureMode(modeKey)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 border shrink-0 ${
                isActive
                  ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 text-xs">
          {/* Active Mode Highlight Banner */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900/80 to-slate-900/60 border border-sky-500/30">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-sky-100 text-[12px]">{info.title}</span>
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold bg-sky-900/80 text-sky-300 border border-sky-700/60">
              {info.badge}
            </span>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">{info.summary}</p>
          </div>

          {/* Scientific Phenomenon */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-400 uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5" />
              <span>Fenômeno Físico & Detecção</span>
            </div>
            <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 leading-snug">
              {info.phenomenon}
            </p>
          </div>

          {/* Impact on Brazil */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Impacto no Território Brasileiro</span>
            </div>
            <p className="text-[11px] text-slate-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40 leading-snug">
              {info.brazilImpact}
            </p>
          </div>

          {/* Technical Specs Mini-Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/60">
            {info.technicalSpecs.map((spec, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                <div className="text-[9px] text-slate-400 uppercase font-mono">{spec.label}</div>
                <div className="text-[10px] text-sky-300 font-semibold truncate mt-0.5" title={spec.value}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Insight */}
      <div className="px-3 py-1.5 bg-slate-900/90 rounded-b-2xl border-t border-slate-800/60 text-[9.5px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-sky-400" />
          <span>Dados de Sensoriamento Orbital</span>
        </span>
        <span className="text-sky-400 font-mono">WGS84</span>
      </div>
    </div>
  );
};
