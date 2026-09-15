import React from 'react';
import { Globe, Satellite, Compass } from 'lucide-react';

interface FooterGlobeTickerProps {
  textureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  isAutoRotate?: boolean;
}

/**
 * FooterGlobeTicker
 * Ticker contextual do rodapé para o Modo Globo 3D Orbital.
 * Apresenta o status de órbita, camada de satélite e dados planetários com elegância.
 */
export const FooterGlobeTicker: React.FC<FooterGlobeTickerProps> = ({
  textureMode = 'nasa_satellite',
  isAutoRotate = true,
}) => {
  const getTextureName = () => {
    switch (textureMode) {
      case 'night_lights':
        return 'Luzes Noturnas Urbanas';
      case 'natural_earth':
        return 'Natural Earth Cartográfica';
      case 'nasa_satellite':
      default:
        return 'Satélite NASA Blue Marble';
    }
  };

  return (
    <div
      id="painel-ticker-globo-rodape"
      className="painel-ticker-globo-rodape flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-xs shadow-md animate-in fade-in duration-150 select-none overflow-hidden"
    >
      <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
        <Globe className="w-3.5 h-3.5 animate-pulse" />
        <span className="font-serif tracking-tight">Globo 3D</span>
      </div>

      <div className="hidden md:flex items-center gap-1 text-slate-400 text-[11px] font-mono">
        <span>•</span>
        <Satellite className="w-3 h-3 text-cyan-400" />
        <span className="text-slate-300">{getTextureName()}</span>
      </div>

      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
        <Compass className="w-3 h-3 text-emerald-400" />
        <span>Foco: Brasil</span>
        {isAutoRotate && <span className="text-[10px] text-blue-400 ml-1">(Órbita Ativa)</span>}
      </div>
    </div>
  );
};
