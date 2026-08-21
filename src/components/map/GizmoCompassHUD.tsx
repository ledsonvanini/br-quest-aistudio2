import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass, RotateCcw, Eye, Layers, Maximize2, Globe } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export type MapAnglePreset = '2d_flat' | 'iso_suave' | 'iso_classico' | 'perspectiva_3d';

interface GizmoCompassHUDProps {
  headingAngle: number; // Z-rotation / compass heading in degrees (0 = North up)
  pitchAngle: number;   // X-rotation / tilt angle in degrees (0 = flat 2D, 42 = isometric)
  onHeadingChange: (newHeading: number) => void;
  onPitchChange: (newPitch: number) => void;
  onResetNorth: () => void;
  onSelectPreset: (preset: MapAnglePreset) => void;
  is3D: boolean;
  isGlobe3DActive?: boolean;
  onToggleGlobe3D?: () => void;
}

export const GizmoCompassHUD: React.FC<GizmoCompassHUDProps> = ({
  headingAngle,
  pitchAngle,
  onHeadingChange,
  onPitchChange,
  onResetNorth,
  onSelectPreset,
  is3D,
  isGlobe3DActive = false,
  onToggleGlobe3D,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDraggingCompass, setIsDraggingCompass] = useState(false);
  const compassContainerRef = useRef<HTMLDivElement | null>(null);
  const menuPopoverRef = useRef<HTMLDivElement | null>(null);
  const startDragRef = useRef<{ angle: number; startHeading: number }>({ angle: 0, startHeading: 0 });

  // Escape key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuPopoverRef.current &&
        !menuPopoverRef.current.contains(e.target as Node) &&
        compassContainerRef.current &&
        !compassContainerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Calculate cardinal heading label for restricted ±45° range
  const getHeadingLabel = (deg: number) => {
    if (Math.abs(deg) < 2) return 'N (Norte)';
    if (deg > 0) {
      if (deg >= 38) return 'L (Leste +45°)';
      return `NE (+${Math.round(deg)}°)`;
    } else {
      if (deg <= -38) return 'O (Oeste -45°)';
      return `NO (${Math.round(deg)}°)`;
    }
  };

  // Helper to compute angle from center of compass
  const getAngleFromEvent = (e: MouseEvent | React.MouseEvent) => {
    if (!compassContainerRef.current) return 0;
    const rect = compassContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    // Returns angle in degrees where top is 0 (North), right is 90 (East)
    const rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return deg;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingCompass(true);
    const initialPointerAngle = getAngleFromEvent(e);
    startDragRef.current = {
      angle: initialPointerAngle,
      startHeading: headingAngle,
    };
    audioEngine.playSfx('click');
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingCompass) return;
      const currentPointerAngle = getAngleFromEvent(e);
      let deltaAngle = currentPointerAngle - startDragRef.current.angle;
      while (deltaAngle > 180) deltaAngle -= 360;
      while (deltaAngle < -180) deltaAngle += 360;

      // Applied sensitivity factor (0.45x) and clamped to maximum ±45° range
      const dampedDelta = deltaAngle * 0.45;
      const rawHeading = startDragRef.current.startHeading + dampedDelta;
      const clampedHeading = Math.max(-45, Math.min(45, Math.round(rawHeading)));
      onHeadingChange(clampedHeading);
    },
    [isDraggingCompass, onHeadingChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingCompass) {
      setIsDraggingCompass(false);
    }
  }, [isDraggingCompass]);

  useEffect(() => {
    if (isDraggingCompass) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCompass, handleMouseMove, handleMouseUp]);

  // Click on cardinal points clamped to max 45°
  const handleCardinalClick = (e: React.MouseEvent, targetHeading: number) => {
    e.stopPropagation();
    audioEngine.playSfx('click');
    const clampedTarget = Math.max(-45, Math.min(45, targetHeading));
    onHeadingChange(clampedTarget);
  };

  const isFacingNorth = Math.abs(headingAngle) < 1.5;

  return (
    <div
      id="gizmo-compass-hud"
      className="painel-gizmo-bussola fixed bottom-0.5 right-2 sm:right-3 z-40 flex flex-col items-center select-none pointer-events-auto"
    >
      {/* 1. Angle & Preset Options Popover */}
      {isMenuOpen && (
        <div
          ref={menuPopoverRef}
          className="painel-presets-gizmo mb-1 w-64 bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-black/80 rounded-2xl p-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 z-50"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Perspectiva & Orientação
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {Math.round(headingAngle)}° • {Math.round(pitchAngle)}°
            </span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onSelectPreset('2d_flat');
                audioEngine.playSfx('click');
              }}
              className={`btn-gizmo-preset-2d flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                !is3D || pitchAngle === 0
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-bold font-serif">
                <Eye className="w-3.5 h-3.5" />
                2D Cartográfico
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">Plano zenital (0°)</span>
            </button>

            <button
              onClick={() => {
                onSelectPreset('iso_suave');
                audioEngine.playSfx('click');
              }}
              className={`btn-gizmo-preset-suave flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                is3D && pitchAngle === 30
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-bold font-serif">
                <Layers className="w-3.5 h-3.5" />
                Iso Suave
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">Inclinação 30°</span>
            </button>

            <button
              onClick={() => {
                onSelectPreset('iso_classico');
                audioEngine.playSfx('click');
              }}
              className={`btn-gizmo-preset-iso flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                is3D && pitchAngle === 42
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-bold font-serif">
                <Compass className="w-3.5 h-3.5" />
                Iso Clássico
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">RPG Padrão 42°</span>
            </button>

            <button
              onClick={() => {
                onSelectPreset('perspectiva_3d');
                audioEngine.playSfx('click');
              }}
              className={`btn-gizmo-preset-perspectiva flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                is3D && pitchAngle >= 55
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-bold font-serif">
                <Maximize2 className="w-3.5 h-3.5" />
                Perspectiva 3D
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">Profundidade 58°</span>
            </button>
          </div>

          {/* Slider de Inclinação Manual */}
          <div className="flex flex-col gap-1 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Inclinação (Pitch)</span>
              <span className="text-amber-400 font-bold">{Math.round(pitchAngle)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="52"
              step="1"
              value={Math.min(52, pitchAngle)}
              onChange={(e) => onPitchChange(Math.min(52, Number(e.target.value)))}
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(Math.min(52, pitchAngle) / 52) * 100}%, #1e293b ${(Math.min(52, pitchAngle) / 52) * 100}%, #1e293b 100%)`,
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Botão de Alternar Globo 3D Esférico */}
          {onToggleGlobe3D && (
            <button
              onClick={() => {
                onToggleGlobe3D();
                audioEngine.playSfx('click');
              }}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-serif flex items-center justify-between transition-all shadow ${
                isGlobe3DActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white font-bold'
                  : 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Globo 3D Esférico (R3F)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">
                {isGlobe3DActive ? 'Ativo' : 'Inativo'}
              </span>
            </button>
          )}

          {/* Botão de Reset ao Norte */}
          <button
            onClick={() => {
              onResetNorth();
              audioEngine.playSfx('click');
            }}
            className="btn-reset-norte w-full py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-xs font-serif text-amber-300 flex items-center justify-center gap-1.5 transition-all shadow"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            Alinhar ao Norte Geográfico (0°)
          </button>
        </div>
      )}

      {/* 3. Main 3D Antique Compass Rose Gizmo with Overlapping Top Badge */}
      <div className="container-gizmo-compass-3d relative flex flex-col items-center justify-center group">
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 filter blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />

        {/* 2. Orientation Readout Badge Placed DIRECTLY OVER / ATOP the Compass Rose */}
        <button
          onClick={() => {
            if (!isFacingNorth) {
              onResetNorth();
              audioEngine.playSfx('click');
            } else {
              setIsMenuOpen((prev) => !prev);
            }
          }}
          className={`badge-orientacao-gizmo z-30 -mb-2 px-2.5 py-0.5 rounded-full backdrop-blur-md border text-[10px] font-mono transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
            !isFacingNorth
              ? 'animate-pulse bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 border-amber-400 text-amber-200 hover:border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-slate-950/90 border-amber-600/50 text-amber-300 hover:text-white hover:border-amber-400'
          }`}
          title={!isFacingNorth ? 'Clique para alinhar ao Norte (0°)' : 'Abrir configurações de perspectiva e rotação'}
        >
          <span className="font-bold">{getHeadingLabel(headingAngle)}</span>
          <span className="text-amber-500/60">•</span>
          <span>{Math.round(pitchAngle)}°</span>
          {!isFacingNorth && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping ml-0.5" />
          )}
        </button>

        {/* Outer Circular Brass Bezel & Interactive Controls Container */}
        <div
          ref={compassContainerRef}
          onMouseDown={handleMouseDown}
          className={`card-gizmo-compass relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-grab ${
            isDraggingCompass ? 'cursor-grabbing scale-105 shadow-amber-500/30' : 'hover:scale-105'
          } transition-transform duration-200 bg-slate-950/85 backdrop-blur-md border border-amber-600/50 shadow-2xl p-1 flex items-center justify-center`}
          style={{
            perspective: '600px',
          }}
          title="Arraste para girar a bússola ou clique nas pontas (N, S, L, O)"
        >
          {/* Compass SVG Graphic */}
          <svg
            viewBox="-110 -110 220 220"
            className="w-full h-full transform-gpu"
            style={{
              transform: `rotate(${headingAngle}deg)`,
              transition: isDraggingCompass ? 'none' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Concentric Decorative Rings */}
            <circle r="96" fill="none" stroke="#d97706" strokeWidth="2.5" strokeOpacity="0.4" />
            <circle r="104" fill="none" stroke="#92400e" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
            <circle r="88" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.3" />

            {/* Minor Ticks every 30 degrees */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="-92"
                x2="0"
                y2="-96"
                stroke="#b45309"
                strokeWidth="1.2"
                transform={`rotate(${deg})`}
              />
            ))}

            {/* 16-point Compass Star */}
            {/* North Point (Golden Spear - Distinctive highlight) */}
            <g className="eixo-gizmo-norte">
              <path d="M 0 0 L -14 -24 L 0 -92 L 14 -24 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.4" />
              <path d="M 0 0 L 0 -92 L 14 -24 Z" fill="#fbbf24" opacity="0.95" />
            </g>

            {/* South Point */}
            <g className="eixo-gizmo-sul">
              <path d="M 0 0 L -12 20 L 0 76 L 12 20 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
              <path d="M 0 0 L 0 76 L 12 20 Z" fill="#d97706" opacity="0.85" />
            </g>

            {/* East Point (Leste) */}
            <g className="eixo-gizmo-leste">
              <path d="M 0 0 L 20 -12 L 76 0 L 20 12 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
              <path d="M 0 0 L 76 0 L 20 12 Z" fill="#d97706" opacity="0.85" />
            </g>

            {/* West Point (Oeste) */}
            <g className="eixo-gizmo-oeste">
              <path d="M 0 0 L -20 -12 L -76 0 L -20 12 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
              <path d="M 0 0 L -76 0 L -20 -12 Z" fill="#d97706" opacity="0.85" />
            </g>

            {/* Diagonal Intermediate Points */}
            <path d="M 0 0 L -7 -18 L -48 -48 L -18 -7 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.75" />
            <path d="M 0 0 L 7 -18 L 48 -48 L 18 -7 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.75" />
            <path d="M 0 0 L -7 18 L -48 48 L -18 7 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.75" />
            <path d="M 0 0 L 7 18 L 48 48 L 18 7 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.75" />

            {/* Center Jewel */}
            <circle r="15" fill="#78350f" stroke="#fef08a" strokeWidth="2.2" />
            <circle r="8" fill="#fbbf24" />
            <circle r="3.5" fill="#ffffff" />

            {/* Cardinal Letters that rotate with compass */}
            <text x="0" y="-72" textAnchor="middle" fill="#fde047" fontSize="15" fontFamily="serif" fontWeight="bold" letterSpacing="1">
              N
            </text>
            <text x="0" y="70" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
              S
            </text>
            <text x="66" y="5" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
              L
            </text>
            <text x="-66" y="5" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
              O
            </text>
          </svg>

          {/* Non-rotating Cardinal Click Targets (Top 'N' pulses with vibrant indicator when not aligned to North) */}
          <button
            onClick={(e) => {
              handleCardinalClick(e, 0);
              onResetNorth();
            }}
            className={`btn-gizmo-ponto-norte absolute top-0.5 inset-x-0 mx-auto w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-black transition-all cursor-pointer z-20 ${
              !isFacingNorth
                ? 'animate-pulse bg-gradient-to-br from-red-600 to-amber-500 text-white ring-2 ring-yellow-300 shadow-[0_0_12px_rgba(239,68,68,0.95)] scale-110 hover:scale-125'
                : 'text-amber-300 hover:text-white hover:bg-amber-500/30'
            }`}
            title="Alinhar ao Norte Geográfico (0°)"
          >
            N
          </button>
          <button
            onClick={(e) => handleCardinalClick(e, 0)}
            className="absolute bottom-0.5 inset-x-0 mx-auto w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-bold text-amber-300/80 hover:text-white hover:bg-amber-500/30 transition cursor-pointer z-10"
            title="Alinhar ao Centro / Norte (0°)"
          >
            S
          </button>
          <button
            onClick={(e) => handleCardinalClick(e, 45)}
            className="absolute right-0.5 inset-y-0 my-auto w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-bold text-amber-300/80 hover:text-white hover:bg-amber-500/30 transition cursor-pointer z-10"
            title="Perspectiva Leste (+45°)"
          >
            L
          </button>
          <button
            onClick={(e) => handleCardinalClick(e, -45)}
            className="absolute left-0.5 inset-y-0 my-auto w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-bold text-amber-300/80 hover:text-white hover:bg-amber-500/30 transition cursor-pointer z-10"
            title="Perspectiva Oeste (-45°)"
          >
            O
          </button>

          {/* Center Toggle Button for Preset Menu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
              audioEngine.playSfx('click');
            }}
            className="btn-toggle-menu-gizmo absolute w-7 h-7 rounded-full bg-amber-950/90 border border-amber-400 hover:border-amber-200 hover:scale-110 active:scale-95 text-amber-300 flex items-center justify-center shadow-lg transition-all z-10 cursor-pointer"
            title="Configurações de Ângulo e Projeção"
          >
            <Compass className={`w-3.5 h-3.5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 text-white' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
