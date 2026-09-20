import React from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { ALL_BRAZIL_STATES } from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { Shield, Sparkles, CheckCircle2, Swords, Trophy, MapPin, Compass } from 'lucide-react';
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
  // Quando qualquer estado estiver selecionado/isolado em outro modo, oculta os pins do mapa
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
        const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);

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
            {/* 0. EXPANDED HIT TRIGGER FOR ACCURATE CLICK & HOVER DETECTION          */}
            {/* ==================================================================== */}
            <div
              className="hitbox-estado-expandida absolute -left-8 -top-8 w-16 h-16 rounded-full pointer-events-auto cursor-pointer z-20"
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
            {/* 1. GROUND BEACON CIRCLE - BEAUTIFUL, ANIMATED CARTOGRAPHIC JEWEL     */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-6 -top-6 w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
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
              {/* Ripple Ring 1 (Continuous Pulse) */}
              <div
                className={`anel-radar-pulso-1 absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 ${
                  isActive
                    ? 'border-2 border-amber-300 bg-amber-400/30'
                    : isCompleted
                    ? 'border-2 border-emerald-400 bg-emerald-500/20'
                    : isLocked
                    ? 'border border-slate-700 bg-slate-900/10'
                    : 'border-2 border-amber-400 bg-amber-500/20'
                }`}
                style={{ animationDuration: isActive ? '1.5s' : '2.5s' }}
              />

              {/* Ripple Ring 2 (Steady Wave) */}
              <div
                className={`anel-radar-pulso-2 absolute -inset-1.5 rounded-full pointer-events-none transition-all duration-300 ${
                  isActive
                    ? 'border-2 border-amber-300/80 shadow-[0_0_20px_rgba(245,158,11,0.9)] scale-110'
                    : isCompleted
                    ? 'border border-emerald-400/60 shadow-[0_0_14px_rgba(16,185,129,0.6)]'
                    : isLocked
                    ? 'border border-slate-800'
                    : 'border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                }`}
              />

              {/* Spinning Dashed Halo Ring */}
              <div
                className={`absolute -inset-1 rounded-full border-2 border-dashed pointer-events-none animate-spin ${
                  isActive
                    ? 'border-amber-200 shadow-[0_0_10px_#fef08a]'
                    : isCompleted
                    ? 'border-emerald-300/60'
                    : isLocked
                    ? 'border-slate-800'
                    : 'border-amber-400/40'
                }`}
                style={{ animationDuration: '8s' }}
              />

              {/* Antique Brass & Obsidian Dial Plate */}
              <div
                className={`anel-mostrador-solo relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'border-amber-200 bg-gradient-to-br from-amber-800 via-amber-950 to-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.9)]'
                    : isCompleted
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-800 via-emerald-950 to-slate-950 shadow-[0_0_14px_rgba(52,211,153,0.7)]'
                    : isLocked
                    ? 'border-slate-700 bg-slate-950/95 opacity-60'
                    : 'border-amber-400 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                }`}
              >
                {/* Concentric Golden Inset Ring */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'border-amber-200 bg-amber-400/35'
                      : isCompleted
                      ? 'border-emerald-300 bg-emerald-400/25'
                      : isLocked
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-amber-400/70 bg-amber-500/20'
                  }`}
                >
                  {/* Central Radiant Jewel Orb */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-300 via-yellow-100 to-white shadow-[0_0_12px_#fef08a] scale-125'
                        : isCompleted
                        ? 'bg-gradient-to-tr from-emerald-400 via-emerald-200 to-white shadow-[0_0_10px_#6ee7b7]'
                        : isLocked
                        ? 'bg-slate-600 shadow-none'
                        : 'bg-gradient-to-tr from-amber-400 via-yellow-200 to-white shadow-[0_0_8px_#fde047]'
                    }`}
                  />
                </div>
              </div>

              {/* Tag Permanente da Sigla do Estado para Leitura Imediata (Oculta durante Hover pois o balão assume) */}
              {!isActive && (
                <div
                  className={`tag-sigla-permanente absolute top-8.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md border shadow-xl font-mono font-black text-[11px] sm:text-xs tracking-wider whitespace-nowrap select-none pointer-events-none transition-all duration-200 ${
                    isCompleted
                      ? 'bg-slate-950/95 text-emerald-300 border-emerald-400/80 shadow-[0_2px_10px_rgba(16,185,129,0.5)]'
                      : isLocked
                      ? 'bg-slate-950/95 text-slate-400 border-slate-800'
                      : 'bg-slate-950/95 text-amber-200 border-amber-400/80 shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                  }`}
                >
                  {stateId}
                </div>
              )}
            </div>

            {/* ==================================================================== */}
            {/* 2. RESTING HOISTED FLAG (APARECE APENAS QUANDO CONQUISTADO E NÃO HOVER)*/}
            {/* ==================================================================== */}
            {!isActive && isCompleted && (
              <div
                className="pin-repouso-hasteado pin-estado-conquistado absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group select-none transition-transform duration-200"
                style={{
                  bottom: '16px',
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
                {/* Mastro Dourado */}
                <div className="haste-mastro-mini w-1 h-8 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-sm shadow-md" />

                {/* Quadro da Bandeira Conquistada */}
                <div className="quadro-bandeira-repouso absolute -top-7 w-12 h-7.5 flex items-center justify-center rounded-md overflow-hidden border-2 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.75)] bg-slate-950 group-hover:scale-110 transition-all duration-200">
                  <StateFlag uf={stateId} className="w-full h-full object-cover brightness-105" alt={`Bandeira Conquistada ${stateId}`} />

                  {/* Brasão central */}
                  {coatUrl ? (
                    <div className="brasao-selo-centro absolute inset-0 flex items-center justify-center p-0.5">
                      <div className="w-5 h-5 rounded-full bg-slate-950/85 border border-emerald-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
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

                  {/* Selo de Conquista */}
                  <div className="selo-conquistado absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-amber-300 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* 3. FLOATING SUMMARY BALLOON & FLAG ON HOVER                          */}
            {/* Mostra resumo rico com bandeira, guardião e atalho para Desafio      */}
            {/* ==================================================================== */}
            {isActive && (
              <div
                className="container-balao-flutuante-hover absolute left-0 top-0 pointer-events-auto z-50 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: '0px 0px',
                  transform: `rotateX(-${effectiveTilt}deg)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGuardian(stateId);
                }}
              >
                <div
                  className="balao-resumo-estado-mapa animate-in fade-in zoom-in-95 duration-200 relative flex flex-col items-center pointer-events-auto"
                  style={{
                    bottom: '72px',
                    transform: 'translate(-50%, 0%)',
                  }}
                >
                  {/* Cartão Principal do Balão de Resumo */}
                  <div className="w-64 sm:w-72 bg-slate-950/95 backdrop-blur-xl border-2 border-amber-400/90 rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.95)] shadow-black text-left flex flex-col gap-2 relative group hover:border-amber-300 transition-all">
                    {/* Header: Bandeira Oficial + Nome do Estado + Região */}
                    <div className="flex items-center gap-2.5 pb-2 border-b border-amber-500/30">
                      {/* Mini Moldura de Bandeira */}
                      <div className="w-12 h-8 rounded-lg overflow-hidden border border-amber-300/80 bg-slate-900 shrink-0 shadow-md relative">
                        <StateFlag uf={stateId} className="w-full h-full object-cover" alt={stateInfo.name} />
                        {isCompleted && (
                          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Nome e Capital */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-amber-300 text-xs px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40">
                            {stateId}
                          </span>
                          <h4 className="font-serif font-black text-sm text-slate-100 truncate">
                            {stateInfo.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
                          <span>Capital: <strong className="text-slate-300 font-semibold">{stateInfo.capital}</strong></span>
                        </p>
                      </div>

                      {/* Badge Região */}
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shrink-0">
                        {stateInfo.region}
                      </span>
                    </div>

                    {/* Guardião & Lore Rápida */}
                    {guardian && (
                      <div className="flex items-center gap-2 py-1 px-2 rounded-xl bg-amber-950/40 border border-amber-500/20">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 bg-slate-900 shrink-0">
                          <img
                            src={guardian.avatarUrl}
                            alt={guardian.guardianName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                            {guardian.guardianTitlePt}
                          </div>
                          <div className="font-serif font-bold text-slate-200 truncate">
                            {guardian.guardianName}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Botão: Desafiar Guardião */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGuardian(stateId);
                      }}
                      className="btn-acao-viajar-estado w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs font-serif flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer group-hover:scale-[1.02]"
                    >
                      <Swords className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isCompleted ? 'Revisitar Desafio Guardião' : 'Desafiar Guardião'}</span>
                    </button>
                  </div>

                  {/* Triângulo / Seta do Balão apontando para o Beacon no Solo */}
                  <div className="w-4 h-4 bg-slate-950 border-r-2 border-b-2 border-amber-400/90 rotate-45 -mt-2 shadow-md" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

