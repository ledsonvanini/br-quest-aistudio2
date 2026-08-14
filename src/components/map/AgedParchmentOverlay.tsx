import React from 'react';

/**
 * AgedParchmentOverlay
 * Full-screen antique paper noise, vintage organic fiber grain, and sepia vignette overlay.
 * Uses pure SVG procedural noise with CSS blend modes (overlay & multiply).
 * Strictly organic noise without ANY geometric grid lines or crosshatches.
 * Strictly isolated to the map viewport (pointer-events-none, z-20)
 * so it will NEVER affect HUD, menus, sidebars, or toolbars.
 */
export const AgedParchmentOverlay: React.FC = () => {
  return (
    <div className="camada-papel-envelhecido-overlay absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Procedural High-Frequency Natural Paper Fiber Noise Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="naturalPaperGrainNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="noStitch"
              result="fineGrain"
            />
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 0 0.93
                0 0 0 0 0.86
                0 0 0 0 0.72
                0 0 0 0.32 0"
              in="fineGrain"
              result="coloredGrain"
            />
          </filter>
        </defs>
      </svg>

      {/* 2. Paper Grain Fiber Noise Layer with Blend Mode Overlay (No Grid) */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none"
        style={{
          filter: 'url(#naturalPaperGrainNoise)',
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #ecdcb4 70%, #c4a974 100%)',
        }}
      />

      {/* 3. Antique Parchment Warm Stain & Sepia Vignette (Burned Edges of Old Cartography) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(245, 235, 210, 0.02) 0%, rgba(210, 185, 140, 0.08) 55%, rgba(120, 85, 45, 0.28) 82%, rgba(25, 15, 6, 0.65) 100%)',
        }}
      />
    </div>
  );
};
