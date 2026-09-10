/**
 * GlobeCameraMenu
 * Dedicated Camera Navigation Menu with presets for:
 * a) Complete Solar System (Orthogonal Top-Down view of Sun and coplanar orbits)
 * b) Focus on Earth and Moon (Binomial framing in scientific scale)
 * c) Syzygy alignment among all planets
 * d) Solar Eclipse viewpoint
 * e) Standard Brazil / Earth view
 */
import React from 'react';
import { Camera, Sun, Moon, Sparkles, Orbit, Compass, ChevronDown, Check } from 'lucide-react';

export interface CameraPresetItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  iconType: 'sun' | 'earth-moon' | 'alignment' | 'eclipse' | 'brazil';
}

export const CAMERA_NAV_PRESETS: CameraPresetItem[] = [
  {
    id: 'sistema-ortogonal',
    name: 'Sistema Completo (Ortogonal)',
    subtitle: 'Visão zenital perpendicular sobre o Sol e órbitas concêntricas',
    badge: 'Visão Zenital',
    iconType: 'sun',
  },
  {
    id: 'terra-lua',
    name: 'Foco na Terra e Lua',
    subtitle: 'Enquadramento aproximado em escala geométrica e distância real',
    badge: 'Foco Binário',
    iconType: 'earth-moon',
  },
  {
    id: 'alinhamento-astros',
    name: 'Alinhamento dos Astros',
    subtitle: 'Sizígia com todos os planetas em linha radial a partir do Sol',
    badge: 'Sizígia Cósmica',
    iconType: 'alignment',
  },
  {
    id: 'eclipse-solar',
    name: 'Visão de Eclipse Solar',
    subtitle: 'Perspectiva alinhada no cone de sombra Sol-Lua-Terra',
    badge: 'Eclipse Umbra',
    iconType: 'eclipse',
  },
  {
    id: 'foco-brasil',
    name: 'Foco no Brasil (Padrão)',
    subtitle: 'Visão centralizada sobre as 27 UFs e América do Sul',
    badge: 'Padrão Terra',
    iconType: 'brazil',
  },
];

interface GlobeCameraMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activePresetId?: string;
  onSelectPreset: (presetId: string) => void;
}

export const GlobeCameraMenu: React.FC<GlobeCameraMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  activePresetId = 'foco-brasil',
  onSelectPreset,
}) => {
  const activePreset =
    CAMERA_NAV_PRESETS.find((p) => p.id === activePresetId) || CAMERA_NAV_PRESETS[0];

  const renderIcon = (type: CameraPresetItem['iconType'], isSelected: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`;
    switch (type) {
      case 'sun':
        return <Sun className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-amber-300'}`} />;
      case 'earth-moon':
        return <Orbit className={iconClass} />;
      case 'alignment':
        return <Sparkles className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-cyan-400'}`} />;
      case 'eclipse':
        return <Moon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-300' : 'text-indigo-400'}`} />;
      case 'brazil':
      default:
        return <Compass className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-400'}`} />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        id="btn-camera-visoes-sistema"
        onClick={onToggle}
        className={`btn-camera-visoes-sistema flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
          isOpen || (activePresetId && activePresetId !== 'foco-brasil')
            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
            : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white'
        }`}
        title={`Câmeras e Visões do Sistema: ${activePreset.name}`}
      >
        <Camera className="w-4 h-4 text-cyan-300" />
        <ChevronDown
          className={`w-3 h-3 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="popover-cameras-astronomicas"
          className="popover-cameras-astronomicas absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-72 sm:w-80 rounded-2xl bg-[#030712] border border-cyan-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                Câmeras & Visões do Sistema
              </span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              5 Presets
            </span>
          </div>

          <div className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-0.5">
            {CAMERA_NAV_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`btn-preset-cam-${preset.id}`}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400/80 shadow-md shadow-cyan-500/20 font-semibold'
                      : 'bg-slate-950/70 hover:bg-slate-900/90 text-slate-300 hover:text-white border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <div className="mt-0.5">{renderIcon(preset.iconType, isSelected)}</div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-100">{preset.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected
                              ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                        {preset.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0 ml-1.5 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
