import React, { useState } from 'react';
import { SOUTH_AMERICA_NEIGHBORS, NeighborCountryData } from '../../data/southAmericaNeighborsData';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { MapPin, Shield, Sparkles } from 'lucide-react';

interface NeighborCountryPinsLayerProps {
  visible: boolean;
  onSelectCountry?: (country: NeighborCountryData) => void;
  hoveredCountryId?: string | null;
  onCountryEnter?: (countryId: string) => void;
  onCountryLeave?: (countryId: string) => void;
}

export const NeighborCountryPinsLayer: React.FC<NeighborCountryPinsLayerProps> = ({
  visible,
  onSelectCountry,
  hoveredCountryId,
  onCountryEnter,
  onCountryLeave,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!visible) return null;

  return (
    <div
      className="camada-pins-vizinhos absolute inset-0 pointer-events-none"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {SOUTH_AMERICA_NEIGHBORS.map((country) => {
        const [x, y] = country.centroid;
        const isHovered = hoveredCountryId === country.id;
        const hasImgError = imageErrors[country.id];

        return (
          <div
            key={country.id}
            id={`pin-vizinho-${country.id.toLowerCase()}`}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: '0px',
              height: '0px',
              transformStyle: 'preserve-3d',
              zIndex: isHovered ? 50 : 25,
            }}
            className={`ancora-pais-vizinho ancora-pin-${country.id.toLowerCase()} select-none`}
          >
            {/* 1. Ground Beacon Eyelet */}
            <div
              className={`circulo-beacon-vizinho absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
                isHovered ? 'scale-125' : 'hover:scale-110'
              }`}
              onMouseEnter={() => onCountryEnter?.(country.id)}
              onMouseLeave={() => onCountryLeave?.(country.id)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCountry?.(country);
              }}
            >
              <div
                className={`anel-radar-vizinho absolute inset-0 rounded-full anim-ground-beacon-pulse pointer-events-none ${
                  country.isDirectNeighbor
                    ? 'border border-sky-400/60 bg-sky-500/10'
                    : 'border border-amber-400/50 bg-amber-500/10'
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isHovered
                    ? 'border-amber-300 bg-amber-400/30 shadow-[0_0_10px_#f59e0b]'
                    : 'border-sky-300/80 bg-slate-900/90 shadow-[0_0_6px_rgba(56,189,248,0.4)]'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHovered ? 'bg-amber-300 shadow-[0_0_4px_#fde047]' : 'bg-sky-400'
                  }`}
                />
              </div>
            </div>

            {/* 2. Flagpole & Mast tilted at 45° relative to map plane */}
            <div
              className="container-estandarte-vizinho absolute left-0 top-0 pointer-events-none anim-pin-spring-in"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '0px 0px',
                transform: 'rotateX(-45deg)',
              }}
              onMouseEnter={() => onCountryEnter?.(country.id)}
              onMouseLeave={() => onCountryLeave?.(country.id)}
            >
              {/* Vertical Flagpole Mast connecting Pin (0,0) to Center of Flag and crowning the top */}
              <div
                className="haste-mastro-bandeira absolute left-0 -translate-x-1/2 w-2 pointer-events-none"
                style={{
                  bottom: '0px',
                  height: '144px',
                  background: 'linear-gradient(to right, #78350f, #d97706, #fbbf24, #fef3c7, #b45309)',
                  boxShadow: isHovered
                    ? '0 0 14px rgba(251, 191, 36, 0.9), 2px 2px 6px rgba(0,0,0,0.9)'
                    : '0 0 8px rgba(251, 191, 36, 0.6), 1px 1px 4px rgba(0,0,0,0.85)',
                  borderRadius: '2px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Base collar connecting directly to the ground beacon pin center */}
                <div className="anel-base-mastro absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2.5 rounded-full bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-[0_0_8px_#f59e0b] border border-amber-400/80" />

                {/* Central Flag Mounting Bracket (Abraçadeira no centro exato da bandeira) */}
                <div
                  className="abracadeira-centro-bandeira absolute left-1/2 -translate-x-1/2 w-3.5 h-6 rounded bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-200 border border-yellow-200/90 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                  style={{ bottom: '78px' }}
                />

                {/* Masthead Golden Finial Ball at the very top of the mast */}
                <div className="ponta-mastro-dourada absolute -top-3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-white shadow-[0_0_10px_#fef08a] border border-yellow-300/80" />
              </div>

              {/* National Flag Banner & Name Pill centered exactly on the Mast at height 90px */}
              <div
                className="estandarte-bandeira-pais absolute left-0 flex flex-col items-center pointer-events-auto cursor-pointer group"
                style={{
                  bottom: '90px',
                  transform: 'translate(-50%, 50%)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCountry?.(country);
                }}
              >
                {/* Hover Aura */}
                <div
                  className={`aura-bandeira-vizinho absolute -inset-3 rounded-2xl bg-amber-400/25 blur-lg pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-85'
                  }`}
                />

                {/* Flag Card Frame (Dobro do tamanho: 112px x 80px com borda metálica nobre) */}
                <div
                  className={`quadro-bandeira-nacional relative w-28 h-20 rounded-lg overflow-hidden border-2 shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-all duration-300 flex items-center justify-center ${
                    isHovered
                      ? 'border-amber-300 ring-2 ring-amber-400/70 shadow-[0_0_24px_rgba(245,158,11,0.9)] scale-110'
                      : 'border-slate-600 hover:border-amber-400 shadow-black/90'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  }}
                >
                  {!hasImgError ? (
                    <img
                      src={country.flagUrl}
                      alt={`Bandeira de ${country.name}`}
                      className="w-full h-full object-cover brightness-105 contrast-105 transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => setImageErrors((prev) => ({ ...prev, [country.id]: true }))}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2">
                      <span className="text-3xl">{country.flagEmoji}</span>
                    </div>
                  )}
                </div>

                {/* Parchment Country Name Pill */}
                <div
                  className={`pill-nome-pais-vizinho mt-1.5 px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-all ${
                    isHovered
                      ? 'bg-amber-950/95 border-amber-300 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.6)] scale-105'
                      : 'bg-slate-950/90 border-slate-700 text-slate-200 group-hover:border-amber-400/70 group-hover:text-amber-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm select-none leading-none">{country.flagEmoji}</span>
                  <span className="text-xs font-serif font-bold tracking-wide whitespace-nowrap leading-none">
                    {country.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
