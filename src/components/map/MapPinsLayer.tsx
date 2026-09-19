import React from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { ALL_BRAZIL_STATES } from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { Shield, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { StateFlag } from '../StateFlag';
import { getStateHeraldicInfo } from '../../data/coatOfArms';
import { getStateRegion } from './stateStyling/stateFillStyler';
import { AppMainMode } from '../../types';

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
  selectedCampaign?: string;
  mainMode?: AppMainMode;
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
  selectedCampaign = 'todos',
  mainMode = 'aventura',
}) => {
  // Quando qualquer estado estiver selecionado/isolado, oculta os pins do mapa
  if (selectedStateId) return null;

  const isRegionCampaignActive = selectedCampaign && selectedCampaign !== 'todos' && selectedCampaign !== 'livre';

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

        const stateRegion = getStateRegion(stateId);
        const isLocked = isRegionCampaignActive && stateRegion !== selectedCampaign;

        const heraldic = getStateHeraldicInfo(stateId);
        const coatUrl = heraldic?.coatUrl || stateInfo.coatOfArmsUrl || heraldic?.fallbackUrl;

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
            {/* Beautiful, animated cartographic jewel at the center of each state   */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-5 -top-5 w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-transform duration-300 ${
                isActive ? 'scale-125 z-40' : 'hover:scale-115'
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
              {/* Outer Radiant Echo Wave (Primary Pulse) */}
              <div
                className={`anel-radar-pulso absolute inset-0 rounded-full anim-ground-beacon-pulse pointer-events-none ${
                  isActive
                    ? 'border-2 border-amber-300 bg-amber-400/30 shadow-[0_0_18px_rgba(245,158,11,0.8)]'
                    : isCompleted
                    ? 'border-2 border-emerald-400/80 bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : isLocked
                    ? 'border border-slate-700/60 bg-slate-900/10'
                    : 'border-2 border-amber-400/70 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                }`}
              />

              {/* Secondary Harmonic Ring */}
              <div
                className={`absolute -inset-1 rounded-full border border-dashed pointer-events-none ${
                  isActive
                    ? 'border-amber-300/80 anim-beacon-halo-rotate'
                    : isCompleted
                    ? 'border-emerald-400/50 anim-beacon-halo-rotate'
                    : isLocked
                    ? 'border-slate-800'
                    : 'border-amber-400/40 anim-beacon-halo-rotate'
                }`}
              />

              {/* Antique Brass Cartographic Dial Plate */}
              <div
                className={`anel-mostrador-solo relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'border-amber-300 bg-gradient-to-br from-amber-900 via-amber-950 to-black shadow-[0_0_16px_rgba(245,158,11,0.9)]'
                    : isCompleted
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-900 via-emerald-950 to-black shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                    : isLocked
                    ? 'border-slate-700 bg-slate-950/95 opacity-60'
                    : 'border-amber-400/90 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                }`}
              >
                {/* Concentric Golden Inset Ring */}
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'border-amber-200 bg-amber-400/30'
                      : isCompleted
                      ? 'border-emerald-300 bg-emerald-400/25'
                      : isLocked
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-amber-400/70 bg-amber-500/20'
                  }`}
                >
                  {/* Central Radiant Gem Orb */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full anim-beacon-orb-glow ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-400 via-yellow-200 to-white shadow-[0_0_10px_#fef08a]'
                        : isCompleted
                        ? 'bg-gradient-to-tr from-emerald-400 via-emerald-200 to-white shadow-[0_0_8px_#6ee7b7]'
                        : isLocked
                        ? 'bg-slate-600 shadow-none'
                        : 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-white shadow-[0_0_6px_#fde047]'
                    }`}
                  />
                </div>
              </div>

              {/* Tag Permanente da Sigla do Estado para Leitura Imediata */}
              <div
                className={`tag-sigla-permanente absolute top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md border shadow-xl font-mono font-black text-[11px] sm:text-xs tracking-wider whitespace-nowrap select-none pointer-events-none transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-950 text-amber-200 border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.8)] scale-110 opacity-0'
                    : isCompleted
                    ? 'bg-slate-950/95 text-emerald-300 border-emerald-400/80 shadow-[0_2px_10px_rgba(16,185,129,0.5)]'
                    : isLocked
                    ? 'bg-slate-950/95 text-slate-400 border-slate-800'
                    : 'bg-slate-950/95 text-amber-200 border-amber-400/80 shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                }`}
              >
                {stateId}
              </div>
            </div>

            {/* Resting Hoisted Flag Pin with Official Coat of Arms Overlay (Shown ONLY for CONQUERED states when not hovered) */}
            {!isActive && isCompleted && (
              <div
                className="pin-repouso-hasteado pin-estado-conquistado absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group select-none transition-transform duration-200"
                style={{
                  bottom: '14px',
                  transformOrigin: 'bottom center',
                  transform: `rotateX(-${effectiveTilt}deg)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGuardian(stateId);
                }}
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
              >
                {/* Wooden / Brass Mast Pole connecting Ground Pin to Flag */}
                <div className="haste-mastro-mini w-1 h-7 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-sm shadow-md" />

                {/* Flag Banner with Victory Frame */}
                <div
                  className="quadro-bandeira-repouso absolute -top-6 w-11 h-7 flex items-center justify-center rounded-md overflow-hidden border-2 border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)] bg-slate-950 group-hover:scale-110 transition-all duration-200"
                >
                  {/* State Flag SVG Background */}
                  <StateFlag uf={stateId} className="w-full h-full object-cover brightness-105" alt={`Bandeira Conquistada ${stateId}`} />

                  {/* Official Coat of Arms Badge Overlay in Center */}
                  {coatUrl ? (
                    <div className="brasao-selo-centro absolute inset-0 flex items-center justify-center p-0.5">
                      <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-slate-950/80 border border-emerald-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                        <img
                          src={coatUrl}
                          alt={`Brasão ${stateId}`}
                          className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Conquered Seal badge */}
                  <div className="selo-conquistado absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-amber-300 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
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
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
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
                    {/* Flag Card Frame: The Ornamental Border framing the Real Flag */}
                    <div className="quadro-moldura-bandeira-real relative w-28 h-18 sm:w-32 sm:h-21 rounded-lg overflow-hidden border-2 border-amber-300 bg-slate-950 ring-1 ring-amber-400/60 shadow-[0_4px_14px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
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

                    {/* State Name Plaque under the Frame (Concise & Legible) */}
                    <div className="placa-nome-bandeira-estado mt-1.5 px-2.5 py-1 rounded-lg border bg-slate-950/95 border-amber-300/80 text-amber-200 shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center gap-1.5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                      <span className="font-mono font-bold text-xs text-amber-300">{stateId}</span>
                      <span className="text-amber-500/70">•</span>
                      <span className="font-sans font-semibold text-xs tracking-wide text-white">{stateInfo.name}</span>
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
