import React from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { ALL_BRAZIL_STATES } from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { StateFlag } from '../StateFlag';

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
  // Quando qualquer estado estiver selecionado/isolado, oculta os pins do mapa
  if (selectedStateId) return null;

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
            {/* 1. GROUND BEACON CIRCLE & PERMANENT HIGH-CONTRAST STATE LABEL       */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-transform duration-300 ${
                isActive ? 'scale-125' : 'hover:scale-115'
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
                    ? 'border-2 border-amber-300 bg-amber-400/25 shadow-[0_0_14px_rgba(245,158,11,0.6)]'
                    : isCompleted
                    ? 'border-2 border-emerald-400/80 bg-emerald-500/15'
                    : 'border-2 border-amber-400/70 bg-amber-500/15'
                }`}
              />

              {/* Antique Metal Cartographic Disc */}
              <div
                className={`anel-mostrador-solo relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'border-amber-300 bg-amber-950/95 shadow-[0_0_12px_rgba(245,158,11,0.85)]'
                    : isCompleted
                    ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                    : 'border-amber-400 bg-slate-950/90 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                }`}
              >
                {/* Concentric Brass Inset Ring */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'border-amber-300 bg-amber-400/20'
                      : isCompleted
                      ? 'border-emerald-300/90 bg-emerald-400/20'
                      : 'border-amber-400/80'
                  }`}
                >
                  {/* Central Core Eyelet Pinpoint (Strict (0,0) center) */}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive
                        ? 'bg-amber-300 shadow-[0_0_8px_#fde047]'
                        : isCompleted
                        ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                        : 'bg-amber-400 shadow-[0_0_4px_#f59e0b]'
                    }`}
                  />
                </div>
              </div>

              {/* Tag Permanente da Sigla do Estado para Leitura Imediata (Para Idosos e Zoom Cheio) */}
              <div
                className={`tag-sigla-permanente absolute top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md border shadow-lg font-mono font-black text-[11px] sm:text-xs tracking-wider whitespace-nowrap select-none pointer-events-none transition-all ${
                  isActive
                    ? 'bg-amber-950 text-amber-200 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)] scale-110 opacity-0'
                    : isCompleted
                    ? 'bg-slate-950/95 text-emerald-300 border-emerald-400/80 shadow-[0_2px_8px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-950/95 text-amber-200 border-amber-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`}
              >
                {stateId}
              </div>
            </div>

            {/* Resting Heraldic Pin (Shown when NOT active to keep map lively) */}
            {!isActive && (
              <div
                className="pin-repouso-brasao-estado absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-200"
                style={{
                  transformOrigin: 'bottom center',
                  transform: `rotateX(-${effectiveTilt}deg)`,
                }}
              >
                <div className="w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400/80 shadow-md flex items-center justify-center p-0.5 overflow-hidden">
                  {stateInfo.coatOfArmsUrl && stateInfo.coatOfArmsUrl.startsWith('/brasao_br/') ? (
                    <img
                      src={stateInfo.coatOfArmsUrl}
                      alt={`Brasão ${stateInfo.name}`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <StateFlag uf={stateId} className="w-full h-full rounded-full object-cover" alt={`Bandeira ${stateId}`} />
                  )}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* 2. FLAGPOLE & MAST TILTED AT -tiltAngle DEGREES (SHOWN ON HOVER)    */}
            {/* Aligned to the center (0,0) in the map on the pulsing ground circle */}
            {/* Acts as the majestic FRAME for the Real State Flag                  */}
            {/* ==================================================================== */}
            {isActive && (
              <div
                className="container-estandarte-estado absolute left-0 top-0 pointer-events-none z-50"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: '0px 0px',
                  transform: `rotateX(-${effectiveTilt}deg)`,
                }}
              >
                <div
                  className="anim-pin-spring-in relative pointer-events-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: '0px 0px',
                  }}
                >
                  {/* Vertical Flagpole Mast connecting Ground Pin (0,0) to Center of Flag and crowning the top */}
                  <div
                    className="haste-mastro-bandeira absolute left-0 -translate-x-1/2 w-2 pointer-events-none"
                    style={{
                      bottom: '0px',
                      height: '148px',
                      background: 'linear-gradient(to right, #78350f, #d97706, #fbbf24, #fef3c7, #b45309)',
                      boxShadow: '0 0 14px rgba(251, 191, 36, 0.9), 2px 2px 6px rgba(0,0,0,0.9)',
                      borderRadius: '2px',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Base collar connecting directly to the ground beacon pin center */}
                    <div className="anel-base-mastro absolute -bottom-1 left-1/2 -translate-x-1/2 w-4.5 h-2.5 rounded-full bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-[0_0_8px_#f59e0b] border border-amber-400/80" />

                    {/* Central Flag Mounting Bracket (Abraçadeira no centro exato da bandeira) */}
                    <div
                      className="abracadeira-centro-bandeira absolute left-1/2 -translate-x-1/2 w-3.5 h-7 rounded bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-200 border border-yellow-200/90 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                      style={{ bottom: '80px' }}
                    />

                    {/* Masthead Golden Finial Ball at the very top of the mast */}
                    <div className="ponta-mastro-dourada absolute -top-3.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-white shadow-[0_0_12px_#fef08a] border border-yellow-300/90" />
                  </div>

                  {/* State Flag Banner & Name Pill centered exactly on the Mast at height 92px */}
                  <div
                    className="estandarte-bandeira-estado absolute left-0 flex flex-col items-center pointer-events-auto cursor-pointer group"
                    style={{
                      bottom: '92px',
                      transform: 'translate(-50%, 50%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectGuardian(stateId);
                    }}
                  >
                    {/* Golden Ambient Glow Behind Frame */}
                    <div className="aura-bandeira-estado absolute -inset-3 rounded-2xl bg-amber-400/35 blur-xl pointer-events-none" />

                    {/* Flag Card Frame: The Ornamental Border framing the Real Flag */}
                    <div className="quadro-moldura-bandeira-real relative w-28 h-18 sm:w-32 sm:h-21 rounded-lg overflow-hidden border-2 border-amber-300 bg-slate-950 ring-2 ring-amber-400/80 shadow-[0_4px_24px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.8)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                      {/* Real Official State Flag rendered as pure vector SVG */}
                      <StateFlag
                        uf={stateId}
                        className="imagem-bandeira-real-estado w-full h-full object-cover brightness-105 contrast-105"
                        alt={`Bandeira Oficial de ${stateInfo.name}`}
                      />
                      {/* Satin Sheen Overlay to give cloth/flag depth inside the frame */}
                      <div className="camada-brilho-tecido absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/15 pointer-events-none" />
                      {/* Inner Bevel Border */}
                      <div className="borda-bisel-interna absolute inset-0 border border-white/20 pointer-events-none rounded-md" />
                    </div>

                    {/* State Name & Capital Plaque under the Frame */}
                    <div className="placa-nome-bandeira-estado mt-1.5 px-3 py-1 rounded-lg border bg-slate-950/95 border-amber-300/90 text-amber-200 shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1.5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                      <span className="font-mono font-black text-xs text-amber-300">{stateId}</span>
                      <span className="text-amber-500/70">•</span>
                      <span className="font-serif font-bold text-xs tracking-wide text-white">{stateInfo.name}</span>
                      {stateInfo.capital && (
                        <>
                          <span className="text-slate-500 text-[10px]">|</span>
                          <span className="text-amber-200/80 text-[11px] font-sans">{stateInfo.capital}</span>
                        </>
                      )}
                    </div>
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
