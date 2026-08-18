import React from 'react';

interface AgedParchmentOverlayProps {
  isParchmentMode?: boolean;
}

/**
 * AgedParchmentOverlay
 * Full-screen antique paper noise, vintage organic fiber grain, tea/coffee aging stains,
 * and burned sepia vignette overlay.
 * Uses pure SVG procedural noise with CSS blend modes (overlay & multiply).
 * Strictly isolated to the map viewport (pointer-events-none, z-20)
 * so it will NEVER affect HUD, menus, sidebars, or toolbars.
 */
export const AgedParchmentOverlay: React.FC<AgedParchmentOverlayProps> = ({
  isParchmentMode = false,
}) => {
  return (
    <div className="camada-papel-envelhecido-overlay absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Procedural High-Frequency Natural Paper Fiber Noise Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="naturalPaperGrainNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.55"
              numOctaves="4"
              stitchTiles="stitch"
              result="fineGrain"
            />
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 0 0.94
                0 0 0 0 0.85
                0 0 0 0 0.68
                0 0 0 0.45 0"
              in="fineGrain"
              result="coloredGrain"
            />
          </filter>

          {/* Organic Tea Stain / Watermark Noise Filter */}
          <filter id="antiqueWatermarkStains" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.015"
              numOctaves="3"
              stitchTiles="stitch"
              result="stainPattern"
            />
            <feColorMatrix
              type="matrix"
              values="
                0.6 0 0 0 0.72
                0 0.45 0 0 0.58
                0 0 0.3 0 0.38
                0 0 0 0.6 0"
              in="stainPattern"
              result="coloredStains"
            />
          </filter>
        </defs>
      </svg>

      {/* 2. Paper Grain Fiber Noise Layer with Blend Mode Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isParchmentMode ? 'opacity-70 mix-blend-overlay' : 'opacity-25 mix-blend-overlay'
        }`}
        style={{
          filter: 'url(#naturalPaperGrainNoise)',
          background: isParchmentMode
            ? 'radial-gradient(circle at 50% 50%, #fffbf0 0%, #ebd7ab 60%, #c9a76d 100%)'
            : 'radial-gradient(circle at 50% 50%, #ffffff 0%, #ecdcb4 70%, #c4a974 100%)',
        }}
      />

      {/* 3. Water / Tea Stains and Ancient Oxidation Spots in Parchment Mode */}
      {isParchmentMode && (
        <div
          className="camada-manchas-agua absolute inset-0 pointer-events-none mix-blend-multiply opacity-55 transition-opacity duration-500"
          style={{
            filter: 'url(#antiqueWatermarkStains)',
          }}
        />
      )}

      {/* 4. Fold Creases Simulation (Old Folded Adventurer's Map) */}
      {isParchmentMode && (
        <div
          className="camada-dobras-mapa absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49.5%, rgba(60,30,10,0.5) 50%, rgba(255,255,255,0.4) 50.5%, transparent 51%),
              linear-gradient(0deg, transparent 49.5%, rgba(60,30,10,0.5) 50%, rgba(255,255,255,0.4) 50.5%, transparent 51%)
            `,
          }}
        />
      )}

      {/* 5. Antique Parchment Warm Stain & Sepia Vignette (Burned Edges of Old Cartography) */}
      <div
        className={`camada-vinheta-sepia absolute inset-0 pointer-events-none mix-blend-multiply transition-opacity duration-500 ${
          isParchmentMode ? 'opacity-85' : 'opacity-35'
        }`}
        style={{
          background: isParchmentMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(245, 235, 210, 0) 0%, rgba(210, 185, 140, 0.15) 45%, rgba(135, 90, 40, 0.55) 75%, rgba(40, 20, 5, 0.92) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(245, 235, 210, 0.02) 0%, rgba(210, 185, 140, 0.08) 55%, rgba(120, 85, 45, 0.28) 82%, rgba(25, 15, 6, 0.65) 100%)',
        }}
      />
    </div>
  );
};

