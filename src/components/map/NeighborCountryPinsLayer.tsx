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
              className="container-estandarte-vizinho absolute pointer-events-none anim-pin-spring-in"
              style={{
                left: '0px',
                bottom: '0px',
                transformStyle: 'preserve-3d',
                transformOrigin: 'bottom center',
                transform: 'rotateX(-45deg) translateY(-4px)',
              }}
              onMouseEnter={() => onCountryEnter?.(country.id)}
              onMouseLeave={() => onCountryLeave?.(country.id)}
            >
              {/* Vertical Flagpole Mast */}
              <div
                className="haste-mastro-bandeira absolute left-1/2 bottom-0 -translate-x-1/2 w-1 pointer-events-none"
                style={{
                  height: '32px',
                  background: 'linear-gradient(to top, #d97706, #fbbf24, #fef3c7)',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                  borderRadius: '2px',
                }}
              >
                {/* Masthead Golden Finial Ball */}
                <div className="ponta-mastro-dourada absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-white shadow-[0_0_6px_#fef08a]" />
              </div>

              {/* National Flag Banner hanging on the mast */}
              <div
                className="estandarte-bandeira-pais relative -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
                style={{ marginBottom: '28px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCountry?.(country);
                }}
              >
                {/* Hover Aura */}
                <div
                  className={`aura-bandeira-vizinho absolute -inset-2 rounded-xl bg-amber-400/20 blur-md pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'
                  }`}
                />

                {/* Flag Card Frame */}
                <div
                  className={`quadro-bandeira-nacional relative w-14 h-10 rounded-md overflow-hidden border-2 shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isHovered
                      ? 'border-amber-300 ring-2 ring-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.8)] scale-110'
                      : 'border-slate-700 hover:border-amber-400 shadow-black/90'
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
                    <div className="flex flex-col items-center justify-center p-1">
                      <span className="text-xl">{country.flagEmoji}</span>
                    </div>
                  )}
                </div>

                {/* Parchment Country Name Pill */}
                <div
                  className={`pill-nome-pais-vizinho mt-1 px-2 py-0.5 rounded-md border backdrop-blur-md shadow-2xl flex items-center gap-1 transition-all ${
                    isHovered
                      ? 'bg-amber-950/95 border-amber-300 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-slate-950/90 border-slate-700/80 text-slate-200 group-hover:border-amber-400/60 group-hover:text-amber-200'
                  }`}
                >
                  <span className="text-[10px] select-none leading-none">{country.flagEmoji}</span>
                  <span className="text-[10px] font-serif font-bold tracking-wide whitespace-nowrap leading-none">
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
