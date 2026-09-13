/**
 * GlobeTextureSelectorMenu - Seletor de Texturas e Mosaicos Orbitais da Terra
 * Permite alternar entre NASA Blue Marble, Natural Earth, Luzes Noturnas e camadas ambientais.
 */
import React from 'react';
import { Layers, Globe2, Check, Info } from 'lucide-react';
import { GlobeTextureMode } from '../../lib/globeEngine/types';
import { TEXTURE_INFO_CATALOG } from '../../data/globeTextureCatalog';

export const TEXTURE_OPTIONS = Object.values(TEXTURE_INFO_CATALOG).map((item) => ({
  id: item.id,
  label: item.title,
  agency: item.agency,
  desc: item.summary,
}));

interface GlobeTextureSelectorMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  textureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  onOpenTextureInfo?: () => void;
}

export const GlobeTextureSelectorMenu: React.FC<GlobeTextureSelectorMenuProps> = ({
  isOpen,
  onToggle,
  textureMode,
  onChangeTextureMode,
  onOpenTextureInfo,
}) => {
  const currentMeta = TEXTURE_INFO_CATALOG[textureMode] || TEXTURE_INFO_CATALOG.nasa_satellite;

  return (
    <div className="relative">
      <button
        type="button"
        id="btn-menu-textura-globo"
        onClick={onToggle}
        className={`btn-menu-textura-globo w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm shrink-0 ${
          isOpen
            ? 'bg-sky-500/30 border-sky-400 text-sky-200 shadow-sky-500/20 ring-1 ring-sky-400/50'
            : 'bg-slate-900/90 hover:bg-slate-850 border-slate-700/80 text-slate-200 hover:text-white'
        }`}
        title={`Texturas e Camadas Globais: ${currentMeta.title.split('(')[0].trim()} (NASA / ESA)`}
        aria-label="Texturas Globais"
      >
        <Globe2 className="w-4 h-4 text-sky-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="popover-seletor-texturas"
          className="popover-seletor-texturas fixed bottom-16 left-[56px] right-2 sm:absolute sm:bottom-full sm:mb-2.5 sm:left-auto sm:right-0 sm:w-80 w-auto max-w-sm max-h-[min(480px,calc(100vh-100px))] overflow-y-auto rounded-2xl bg-[#030712] border border-sky-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700"
        >
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-sky-500/30">
            <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Mosaicos Globais</span>
            </span>
            {onOpenTextureInfo && (
              <button
                type="button"
                id="btn-abrir-info-textura"
                onClick={() => {
                  onOpenTextureInfo();
                  onToggle();
                }}
                className="text-[10px] text-sky-300 hover:text-sky-100 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 cursor-pointer transition-colors"
                title="Ver Especificações Técnicas e Sensores do Mosaico"
              >
                <Info className="w-3 h-3" />
                <span>Metadados</span>
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-0.5">
            {TEXTURE_OPTIONS.map((tex) => {
              const isSelected = textureMode === tex.id;
              return (
                <button
                  key={tex.id}
                  type="button"
                  id={`btn-opcao-textura-${tex.id}`}
                  onClick={() => {
                    onChangeTextureMode(tex.id);
                    onToggle();
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2 border ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400/80 text-sky-200'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{tex.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                      {tex.agency}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                      {tex.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
