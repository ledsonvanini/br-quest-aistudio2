import React from 'react';
import { Waves, Trees, Compass, BarChart3, X } from 'lucide-react';
import { CartographyLayerMode, TERRITORY_LAYERS_CONFIG } from '../../types/cartography';
import { audioEngine } from '../../lib/audioSynth';

interface FooterTerritoryTickerProps {
  activeLayer: CartographyLayerMode;
  onClearLayer: () => void;
}

/**
 * FooterTerritoryTicker
 * Ticker contextual do rodapé para camadas de Território ativas no Mapa 2D.
 */
export const FooterTerritoryTicker: React.FC<FooterTerritoryTickerProps> = ({
  activeLayer,
  onClearLayer,
}) => {
  const layerConfig = TERRITORY_LAYERS_CONFIG.find((c) => c.id === activeLayer);
  if (!layerConfig || activeLayer === 'none') return null;

  const renderIcon = () => {
    switch (layerConfig.iconName) {
      case 'waves':
        return <Waves className="w-3.5 h-3.5 text-cyan-300" />;
      case 'trees':
        return <Trees className="w-3.5 h-3.5 text-emerald-300" />;
      case 'compass':
        return <Compass className="w-3.5 h-3.5 text-amber-300" />;
      case 'barChart':
        return <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  return (
    <div
      id="painel-ticker-territorio-rodape"
      className="painel-ticker-territorio-rodape flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs shadow-md animate-in fade-in duration-150 select-none overflow-hidden"
    >
      <div className="flex items-center gap-1.5 font-bold">
        {renderIcon()}
        <span className="font-serif tracking-tight text-white">{layerConfig.label}</span>
      </div>

      <span
        className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${layerConfig.badgeColor}`}
      >
        {layerConfig.badge}
      </span>

      <button
        id="btn-fechar-camada-territorio-rodape"
        type="button"
        onClick={() => {
          audioEngine.playSfx('click');
          onClearLayer();
        }}
        className="btn-fechar-camada-territorio-rodape ml-1 p-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        title="Desativar camada temática"
        aria-label="Desativar camada temática"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
