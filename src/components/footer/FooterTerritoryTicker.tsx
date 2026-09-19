import React from 'react';
import {
  Waves,
  Trees,
  Route,
  Car,
  Ship,
  Train,
  Anchor,
  RotateCcw,
} from 'lucide-react';
import { CartographyLayerMode } from '../../types/cartography';
import { audioEngine } from '../../lib/audioSynth';

export interface FooterTerritoryTickerProps {
  activeLayer: CartographyLayerMode;
  selectedSubitemId?: string | null;
  onSelectSubitem?: (subitemId: string | null) => void;
  onClearLayer?: () => void;
  onSelectLayer?: (layer: CartographyLayerMode) => void;
  onToggleSubmenu?: () => void;
  isSubmenuOpen?: boolean;
  onClearSelection?: () => void;
}

// Subitens canônicos representados por ícones e siglas compactas
const BASIN_ICON_ITEMS = [
  { id: 'amazonica', short: 'AM', label: 'Bacia Amazônica (132.000 m³/s)', color: '#06b6d4' },
  { id: 'tocantins_araguaia', short: 'TO', label: 'Bacia Tocantins-Araguaia', color: '#0ea5e9' },
  { id: 'sao_francisco', short: 'SF', label: 'Bacia São Francisco (Velho Chico)', color: '#3b82f6' },
  { id: 'parana', short: 'PR', label: 'Bacia do Paraná (Itaipu Binacional)', color: '#6366f1' },
  { id: 'paraguai', short: 'PA', label: 'Bacia do Paraguai (Pantanal)', color: '#14b8a6' },
  { id: 'atlantico_leste', short: 'AT', label: 'Bacias Atlânticas (Costeiras)', color: '#2dd4bf' },
];

const BIOME_ICON_ITEMS = [
  { id: 'amazonia', short: 'AMZ', label: 'Bioma Amazônia (49.3% BR)', color: '#10b981' },
  { id: 'cerrado', short: 'CER', label: 'Bioma Cerrado (Berço das Águas)', color: '#eab308' },
  { id: 'mata_atlantica', short: 'MAT', label: 'Mata Atlântica (Biodiversidade)', color: '#059669' },
  { id: 'caatinga', short: 'CAA', label: 'Caatinga (Semiárido Exclusivo)', color: '#d97706' },
  { id: 'pampa', short: 'PAM', label: 'Pampa (Campos Sulinos)', color: '#84cc16' },
  { id: 'pantanal', short: 'PAN', label: 'Pantanal (Maior Planície)', color: '#14b8a6' },
];

const ROUTE_ICON_ITEMS = [
  { id: 'rodovias', icon: Car, label: 'Rodovias Federais (BR-101, 116, 153)', color: '#f59e0b' },
  { id: 'hidrovias', icon: Ship, label: 'Hidrovias Fluviais (Tietê, Madeira)', color: '#38bdf8' },
  { id: 'ferrovias', icon: Train, label: 'Ferrovias (Norte-Sul, Carajás, Rumo)', color: '#a855f7' },
  { id: 'portos', icon: Anchor, label: 'Portos & Cabotagem (Santos, Paranaguá)', color: '#06b6d4' },
];

export const FooterTerritoryTicker: React.FC<FooterTerritoryTickerProps> = ({
  activeLayer,
  selectedSubitemId,
  onSelectSubitem,
  onClearLayer,
  onSelectLayer,
  onToggleSubmenu,
  isSubmenuOpen,
  onClearSelection,
}) => {
  const handleLayerClick = (e: React.MouseEvent, layer: CartographyLayerMode) => {
    e.stopPropagation();
    audioEngine.playSfx('click');
    if (activeLayer === layer) {
      onToggleSubmenu?.();
    } else {
      onSelectLayer?.(layer);
    }
  };

  const handleSubitemClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    audioEngine.playSfx('click');
    onSelectSubitem?.(selectedSubitemId === id ? null : id);
  };

  return (
    <div
      id="painel-toolbar-territorio-rodape"
      className="painel-toolbar-territorio-rodape flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-slate-950/95 border border-amber-500/50 text-xs shadow-lg animate-in fade-in duration-150 max-w-[96vw] sm:max-w-max overflow-x-auto no-scrollbar shrink-0 select-none text-slate-200"
      role="toolbar"
      aria-label="Controles Cartográficos de Território"
    >
      {/* 1. Ícone Indicador da Camada Principal */}
      <div
        className="flex items-center px-1.5 py-0.5 rounded-md bg-amber-950/90 border border-amber-400/60 text-amber-300 shrink-0"
        title="Módulo Cartográfico de Território e Redes"
      >
        {activeLayer === 'bacias_hidrograficas' ? (
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
        ) : activeLayer === 'biomas_relevo' ? (
          <Trees className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Route className="w-3.5 h-3.5 text-amber-400" />
        )}
      </div>

      {/* 2. Seletores das 3 Camadas Temáticas */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 shrink-0">
        <button
          type="button"
          onClick={(e) => handleLayerClick(e, 'bacias_hidrograficas')}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${
            activeLayer === 'bacias_hidrograficas'
              ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/70 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Bacias Hidrográficas do Brasil (ANA)"
          aria-label="Bacias Hidrográficas"
        >
          <Waves className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => handleLayerClick(e, 'biomas_relevo')}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${
            activeLayer === 'biomas_relevo'
              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/70 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Biomas Oficiais & Relevo (IBGE)"
          aria-label="Biomas e Relevo"
        >
          <Trees className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => handleLayerClick(e, 'rotas_integracao')}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${
            activeLayer === 'rotas_integracao'
              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/70 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Eixos Logísticos e Corredores de Cabotagem"
          aria-label="Rotas de Integração"
        >
          <Route className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

      {/* 3. Subitens Compactos e Clicáveis */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 shrink-0">
        {activeLayer === 'bacias_hidrograficas' &&
          BASIN_ICON_ITEMS.map((item) => {
            const isSelected = selectedSubitemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleSubitemClick(e, item.id)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/35 border border-cyan-300 text-white shadow-[0_0_8px_rgba(6,182,212,0.4)] scale-105'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
                title={item.label}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.short}</span>
              </button>
            );
          })}

        {activeLayer === 'biomas_relevo' &&
          BIOME_ICON_ITEMS.map((item) => {
            const isSelected = selectedSubitemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleSubitemClick(e, item.id)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/35 border border-emerald-300 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
                title={item.label}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.short}</span>
              </button>
            );
          })}

        {activeLayer === 'rotas_integracao' &&
          ROUTE_ICON_ITEMS.map((item) => {
            const isSelected = selectedSubitemId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleSubitemClick(e, item.id)}
                className={`flex items-center justify-center p-1 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/35 border-amber-300 text-white shadow-[0_0_8px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
                title={item.label}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </button>
            );
          })}
      </div>

      {/* Reset / Restaurar Visão Geral */}
      {(selectedSubitemId || onClearSelection) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            audioEngine.playSfx('click');
            onSelectSubitem?.(null);
            onClearSelection?.();
          }}
          className="p-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-amber-400 hover:text-amber-200 hover:bg-slate-850 transition cursor-pointer shrink-0"
          title="Restaurar Visão Geral do Brasil"
          aria-label="Restaurar Visão Geral"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
