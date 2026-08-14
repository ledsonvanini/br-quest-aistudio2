import React from 'react';
import {
  MapVisualStyle,
  ChoroplethSubTheme,
  REGION_COLORS,
  BIOME_COLORS,
} from '../../lib/mapColorScales';

interface MapChoroplethLegendProps {
  visualStyle: MapVisualStyle;
  choroplethSubTheme: ChoroplethSubTheme;
  completedCount: number;
}

export const MapChoroplethLegend: React.FC<MapChoroplethLegendProps> = ({
  visualStyle,
  choroplethSubTheme,
  completedCount,
}) => {
  if (visualStyle !== 'choropleth') return null;

  return (
    <div className="painel-legenda-coropletica absolute bottom-28 left-4 z-20 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl max-w-xs transition-all">
      <div className="cabecalho-legenda flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-800">
        <span className="titulo-legenda text-[11px] font-bold text-amber-300 uppercase tracking-wider">
          {choroplethSubTheme === 'progress' && 'Legenda de Conquistas & XP'}
          {choroplethSubTheme === 'regions' && '5 Macrorregiões do IBGE'}
          {choroplethSubTheme === 'biomes' && 'Biomas Nacionais'}
        </span>
      </div>

      {/* 1. Progress Legend */}
      {choroplethSubTheme === 'progress' && (
        <div className="legenda-progresso-xp space-y-1.5 text-xs">
          <div className="item-legenda flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#065f46] border border-[#34d399] shrink-0" />
            <span className="text-slate-200">
              Concluído / Insígnia Coletada ({completedCount}/27)
            </span>
          </div>
          <div className="item-legenda flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#1e293b] border border-[#475569] shrink-0" />
            <span className="text-slate-400">
              Desafio do Guardião Pendente ({27 - completedCount}/27)
            </span>
          </div>
        </div>
      )}

      {/* 2. IBGE Regions Legend */}
      {choroplethSubTheme === 'regions' && (
        <div className="legenda-regioes-ibge grid grid-cols-1 gap-1 text-[11px]">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <div key={region} className="item-legenda-regiao flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0 border"
                style={{ backgroundColor: color.fill, borderColor: color.stroke }}
              />
              <span className="text-slate-300">{color.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Biomes Legend */}
      {choroplethSubTheme === 'biomes' && (
        <div className="legenda-biomas grid grid-cols-2 gap-1.5 text-[10px]">
          {Object.entries(BIOME_COLORS).map(([biome, color]) => (
            <div key={biome} className="item-legenda-bioma flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0 border"
                style={{ backgroundColor: color.fill, borderColor: color.stroke }}
              />
              <span className="text-slate-300 truncate" title={color.description}>
                {color.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
