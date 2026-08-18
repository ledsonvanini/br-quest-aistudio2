import React, { useState } from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import {
  ALL_BRAZIL_STATES,
  getStateCoatOfArmsUrl,
} from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface MapPinsLayerProps {
  centroids: Record<string, [number, number]>;
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  is3D?: boolean;
  tiltAngle?: number;
  onSelectGuardian: (stateId: string) => void;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
}

export const MapPinsLayer: React.FC<MapPinsLayerProps> = ({
  centroids,
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  is3D = true,
  tiltAngle = 42,
  onSelectGuardian,
  onStateEnter,
  onStateLeave,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <div
      className="camada-pins-brasoes absolute inset-0 pointer-events-none"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {ALL_BRAZIL_STATES.map((stateInfo) => {
        const stateId = stateInfo.id;
        const coords = centroids[stateId] || stateInfo.centroid;
        if (!coords) return null;

        const [x, y] = coords;
        const isCompleted = completedStateIds.has(stateId);
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;
        const isActive = isHovered || isSelected;

        const coatOfArmsUrl = getStateCoatOfArmsUrl(stateId) || stateInfo.coatOfArmsUrl;
        const hasImgError = imageErrors[stateId];

        // Counter-tilt for orthogonal view so the banner faces the player camera
        const effectiveTilt = Math.round(tiltAngle || 42);

        return (
          <div
            key={stateId}
            id={`anchor-pin-${stateId}`}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: '0px',
              height: '0px',
              transformStyle: 'preserve-3d',
              zIndex: isActive ? 60 : isCompleted ? 20 : 10,
            }}
            className={`ancora-estado-pin ancora-pin-${stateId.toLowerCase()} select-none`}
          >
            {/* ==================================================================== */}
            {/* 1. GROUND BEACON CIRCLE (Antique Brass Cartographic Eyelet Pin)     */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
                isActive ? 'scale-120' : 'hover:scale-110'
              }`}
              onMouseEnter={() => onStateEnter(stateId)}
              onMouseLeave={() => onStateLeave(stateId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGuardian(stateId);
              }}
            >
              {/* Soft Expanding Pulse Wave */}
              <div
                className={`anel-radar-pulso absolute inset-0 rounded-full anim-ground-beacon-pulse pointer-events-none ${
                  isActive
                    ? 'border border-amber-300/80 bg-amber-400/15 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : isCompleted
                    ? 'border border-emerald-400/50 bg-emerald-500/10'
                    : 'border border-amber-500/40 bg-amber-500/5'
                }`}
              />

              {/* Antique Metal Cartographic Disc (No black fill) */}
              <div
                className={`anel-mostrador-solo relative w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'border-amber-300 bg-amber-400/20 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                    : isCompleted
                    ? 'border-emerald-400/90 bg-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                    : 'border-amber-500/70 bg-amber-500/10 shadow-[0_0_6px_rgba(180,83,9,0.3)]'
                }`}
              >
                {/* Concentric Brass Inset Ring */}
                <div
                  className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'border-amber-300'
                      : isCompleted
                      ? 'border-emerald-300/80'
                      : 'border-amber-400/60'
                  }`}
                >
                  {/* Central Core Eyelet */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-amber-300 shadow-[0_0_4px_#fde047]'
                        : isCompleted
                        ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                        : 'bg-amber-400/90'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* ==================================================================== */}
            {/* 2. HERALDIC CREST PIN (Tilted 45° relative to map plane)             */}
            {/* ==================================================================== */}
            {isActive && (
              <div
                className="container-popup-pin absolute pointer-events-none anim-pin-spring-in"
                style={{
                  left: '0px',
                  bottom: '0px',
                  transformStyle: 'preserve-3d',
                  // The origin is strictly at (0,0) - the center of the ground circle!
                  transformOrigin: 'bottom center',
                  // Tilted 45 degrees relative to map plane so it stands up diagonally like a real map pin
                  transform: 'rotateX(-45deg) translateY(-4px) scale(1.12)',
                }}
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
              >
                {/* Vertical Anchor Mast / Flagpole - Connects Banner Bottom to Exact (0,0) Ground Center at 45° */}
                <div
                  className="haste-ancoragem-centro absolute left-1/2 bottom-0 -translate-x-1/2 w-1 pointer-events-none z-0"
                  style={{
                    height: '26px',
                    background: 'linear-gradient(to top, #d97706, #fbbf24, #fef3c7)',
                    boxShadow: '0 0 8px rgba(251, 191, 36, 0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                    borderRadius: '2px',
                  }}
                >
                  <div className="ponta-mastro-dourada absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-white shadow-[0_0_6px_#fef08a]" />
                </div>

                {/* Particle Sparks Burst on Hover (Originating around the crest) */}
                <div className="particulas-burst-hover absolute left-1/2 bottom-12 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_#fef08a] anim-burst-nw" />
                  <span className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] anim-burst-ne" />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-yellow-100 shadow-[0_0_8px_#ffffff] anim-burst-sw" />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] anim-burst-se" />
                  <span className="absolute w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047] anim-burst-n" />
                </div>

                {/* Pin Banner Body (Sits directly atop the anchor stem) */}
                <div
                  className="corpo-pin-estandarte relative -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
                  style={{ marginBottom: '22px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGuardian(stateId);
                  }}
                >
                  {/* Radiant Aura Glow */}
                  <div className="aura-halo-luz absolute -inset-3 rounded-full bg-amber-400/25 blur-md pointer-events-none animate-pulse" />

                  {/* Medieval RPG Heraldic Crest Shield */}
                  <div
                    className={`moldura-heraldica-brasao relative w-12 h-14 sm:w-13 sm:h-15 rounded-b-xl rounded-t-sm flex items-center justify-center p-1 shadow-2xl transition-all duration-200 z-10 ${
                      isCompleted
                        ? 'bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.7)]'
                        : isSelected
                        ? 'bg-gradient-to-b from-yellow-400 via-amber-700 to-slate-950 border-2.5 border-yellow-200 shadow-[0_0_24px_rgba(253,224,71,0.9)]'
                        : 'bg-gradient-to-b from-yellow-500 via-amber-800 to-slate-950 border-2 border-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]'
                    }`}
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
                    }}
                  >
                    {/* Coat of Arms Image or Fallback */}
                    {coatOfArmsUrl && !hasImgError ? (
                      <img
                        src={coatOfArmsUrl}
                        alt={`Brasão de ${stateInfo.name}`}
                        className="imagem-brasao-estado w-full h-full object-contain p-0.5 filter drop-shadow-md brightness-115"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setImageErrors((prev) => ({ ...prev, [stateId]: true }));
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Shield className="w-5 h-5 text-amber-300" />
                        <span className="text-[10px] font-bold text-amber-200 tracking-wider">
                          {stateId}
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="badge-status-pin absolute -top-1.5 -right-1.5 bg-slate-950/95 border border-amber-300 rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] font-bold text-amber-300 leading-none">
                          ★
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Antique Parchment State Acronym Pill */}
                  <div
                    className={`pill-sigla-estado mt-1 px-2.5 py-0.5 rounded-sm border shadow-xl flex items-center gap-1 transition-all ${
                      isCompleted
                        ? 'bg-amber-950/95 border-amber-300 text-amber-200 font-bold'
                        : isSelected
                        ? 'bg-amber-900 border-yellow-200 text-yellow-100 font-black'
                        : 'bg-slate-900/95 border-yellow-300 text-amber-200 font-bold'
                    }`}
                  >
                    <span className="texto-sigla-estado text-[11px] font-serif font-black tracking-wider leading-none">
                      {stateId}
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
