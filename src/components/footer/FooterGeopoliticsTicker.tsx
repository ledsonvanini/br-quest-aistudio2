import React from 'react';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { getGeopoliticsLegendData } from '../map/GeopoliticsLegendOverlay';

interface FooterGeopoliticsTickerProps {
  geopoliticaMetric: GeopoliticaMetricKey;
}

export const FooterGeopoliticsTicker: React.FC<FooterGeopoliticsTickerProps> = ({
  geopoliticaMetric,
}) => {
  const legend = getGeopoliticsLegendData(geopoliticaMetric);

  return (
    <div
      id="painel-geopolitica-legenda-rodape"
      className="painel-geopolitica-legenda-rodape painel-legenda-coropletica flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-indigo-500/50 text-xs shadow-lg animate-in fade-in duration-150 overflow-x-auto no-scrollbar shrink-0 max-w-[92vw] sm:max-w-max"
    >
      {/* Badge da Métrica Ativa com Ícone */}
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-950/90 border border-indigo-400/60 text-[11px] font-serif text-indigo-200 font-bold shrink-0 shadow-sm"
        title={legend.title}
      >
        {legend.icon}
        <span className="truncate max-w-[120px] sm:max-w-none">{legend.title}</span>
      </div>

      <div className="h-3.5 w-px bg-indigo-500/30 shrink-0" />

      {/* Bullets Coloridos */}
      <div className="secao-itens-legenda-geopolitica flex items-center gap-1 shrink-0">
        {legend.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-[10px] text-slate-200 font-medium shadow-inner shrink-0"
            title={item.label}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-sm border border-black/40"
              style={{ backgroundColor: item.color }}
            />
            <span className="whitespace-nowrap text-[9px] font-sans">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
