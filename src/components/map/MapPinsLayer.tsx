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
            {/* 0. EXPANDED HIT TRIGGER FOR SMALL GEOGRAPHIC STATES (DF, SE, AL, etc.)*/}
            {/* ==================================================================== */}
            <div
              className="hitbox-estado-expandida absolute -left-7 -top-7 w-14 h-14 rounded-full pointer-events-auto cursor-pointer z-20"
              style={{ transform: 'translateZ(0px)' }}
              onMouseEnter={() => onStateEnter(stateId)}
              onMouseLeave={() => onStateLeave(stateId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGuardian(stateId);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title={stateInfo.name}
            />

            {/* ==================================================================== */}
            {/* 1. GROUND BEACON CIRCLE (Antique Brass Cartographic Eyelet Pin)     */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-transform duration-300 ${
                isActive ? 'scale-125' : 'hover:scale-110'
              }`}
              onMouseEnter={() => onStateEnter(stateId)}
              onMouseLeave={() => onStateLeave(stateId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGuardian(stateId);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Soft Expanding Pulse Wave */}
              <div
                className={`anel-radar-pulso absolute inset-0 rounded-full anim-ground-beacon-pulse pointer-events-none ${
                  isActive
                    ? 'border-2 border-amber-300 bg-amber-400/20 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : isCompleted
                    ? 'border border-emerald-400/60 bg-emerald-500/10'
                    : 'border border-amber-500/50 bg-amber-500/10'
                }`}
              />

              {/* Antique Metal Cartographic Disc */}
              <div
                className={`anel-mostrador-solo relative w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'border-amber-300 bg-amber-950/80 shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                    : isCompleted
                    ? 'border-emerald-400/90 bg-emerald-950/70 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                    : 'border-amber-500/70 bg-amber-950/60 shadow-[0_0_6px_rgba(180,83,9,0.3)]'
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
                  {/* Central Core Eyelet Pinpoint (Strict (0,0) center) */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-amber-300 shadow-[0_0_6px_#fde047]'
                        : isCompleted
                        ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                        : 'bg-amber-400/90'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* ==================================================================== */}
            {/* 2. HERALDIC CREST PIN & BANNER (Flagpole Base at Strict Center (0,0)) */}
            {/* ==================================================================== */}
            {isActive && (
              <div
                className="container-popup-pin absolute pointer-events-none anim-pin-spring-in z-50"
                style={{
                  left: '0px',
                  top: '0px',
                  transformStyle: 'preserve-3d',
                  // The origin is strictly at (0,0) - the center of the ground circle!
                  transformOrigin: '0px 0px',
                  transform: 'rotateX(-45deg) translateY(-2px) scale(1.35)',
                }}
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
              >
                {/* Vertical Anchor Mast / Flagpole - Base anchored at strictly (0,0) of the ground circle */}
                <div
                  className="haste-ancoragem-centro absolute left-0 bottom-0 -translate-x-1/2 w-1.5 pointer-events-none z-0"
                  style={{
                    height: '42px',
                    background: 'linear-gradient(to top, #78350f, #d97706, #fde047, #ffffff)',
                    boxShadow: '0 0 8px rgba(251, 191, 36, 0.8), 1px 1px 4px rgba(0,0,0,0.9)',
                    borderRadius: '2px',
                  }}
                >
                  <div className="ponta-mastro-dourada absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-white shadow-[0_0_8px_#fef08a] border border-amber-300" />
                </div>

                {/* Particle Sparks Burst on Hover */}
                <div className="particulas-burst-hover absolute left-0 bottom-20 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                  <span className="absolute w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_#fef08a] anim-burst-nw" />
                  <span className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] anim-burst-ne" />
                  <span className="absolute w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_8px_#ffffff] anim-burst-sw" />
                  <span className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] anim-burst-se" />
                </div>

                {/* Pin Banner Body (Sits on the mast directly above the ground center) */}
                <div
                  className="corpo-pin-estandarte absolute left-0 bottom-10 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGuardian(stateId);
                  }}
                >
                  {/* Subtle Clean Radiant Accent (No Blurry Low Quality Glow) */}
                  <div className="aura-halo-luz absolute -inset-2 rounded-2xl bg-amber-400/20 pointer-events-none" />

                  {/* Medieval RPG Heraldic Crest Shield (40% Black translucent + Gold Border + Official State Coat of Arms) */}
                  <div
                    className={`moldura-heraldica-brasao relative w-18 h-22 sm:w-20 sm:h-24 rounded-b-2xl rounded-t-sm flex items-center justify-center p-1.5 shadow-2xl transition-all duration-200 z-10 ${
                      isCompleted
                        ? 'border-2 border-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.85)] ring-1 ring-yellow-200/60'
                        : isSelected
                        ? 'border-2.5 border-yellow-300 shadow-[0_0_24px_rgba(251,191,36,0.95)] scale-110 ring-1 ring-amber-300/80'
                        : 'border-1.5 border-amber-400/90 shadow-[0_4px_16px_rgba(0,0,0,0.85),0_0_10px_rgba(245,158,11,0.4)]'
                    }`}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.40)',
                      backdropFilter: 'blur(6px)',
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 78%, 50% 100%, 0% 78%)',
                    }}
                  >
                    {/* Subtle Inner Gold Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-black/60 pointer-events-none rounded-b-2xl" />

                    {/* Coat of Arms Image or Fallback */}
                    {coatOfArmsUrl && !hasImgError ? (
                      <img
                        src={coatOfArmsUrl}
                        alt={`Brasão de ${stateInfo.name}`}
                        className="imagem-brasao-estado w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] brightness-110 hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setImageErrors((prev) => ({ ...prev, [stateId]: true }));
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-1">
                        <Shield className="w-8 h-8 text-amber-300 drop-shadow" />
                        <span className="text-xs font-bold text-amber-200 tracking-wider">
                          {stateId}
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="badge-status-pin absolute -top-2 -right-2 bg-slate-950/95 border border-amber-300 rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-bold text-amber-300 leading-none">
                          ★
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Antique Parchment State Acronym Pill */}
                  <div
                    className={`pill-sigla-estado mt-1 px-2.5 py-0.5 rounded border shadow-lg flex items-center gap-1.5 transition-all ${
                      isCompleted
                        ? 'bg-black/60 backdrop-blur-sm border-amber-300 text-amber-100 font-bold'
                        : isSelected
                        ? 'bg-black/70 backdrop-blur-sm border-yellow-300 text-yellow-100 font-black'
                        : 'bg-black/50 backdrop-blur-sm border-amber-400/80 text-amber-200 font-bold'
                    }`}
                  >
                    <span className="texto-sigla-estado text-xs font-serif font-black tracking-widest leading-none">
                      {stateId}
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-sans hidden sm:inline">
                      • {stateInfo.name}
                    </span>
                    <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
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
