import React from 'react';

/**
 * Procedural Antique Parchment & Paper Texture Filters
 * Provides authentic handmade paper fibers, tea-stained watercolor blend,
 * tactile relief hillshade, and imperial fantasy glows.
 */
export const ParchmentTextureFilter: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* 1. Authentic Antique Parchment Paper Texture */}
        <filter id="rpgParchmentPaper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="
              0.25 0 0 0 0.85
              0 0.22 0 0 0.76
              0 0 0.18 0 0.58
              0 0 0 1 0"
            in="noise"
            result="paperColor"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#faf0d7"
            surfaceScale="2.2"
            result="paperRelief"
          >
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" in2="paperRelief" result="blended" />
          <feComposite operator="in" in="blended" in2="SourceGraphic" />
        </filter>

        {/* 2. Tactile 3D Paper Emboss & Inked Edge Drop Shadow */}
        <filter id="rpgStateBorderShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            floodColor="#1a0f05"
            floodOpacity="0.65"
          />
        </filter>

        {/* 3. Golden Mana Glow for Selected / Completed States */}
        <filter id="rpgGoldenAura" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#fbbf24" floodOpacity="0.8" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="coloredGlow" />
          <feMerge>
            <feMergeNode in="coloredGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 4. Ocean Depth Cartographic Gradient */}
        <radialGradient id="rpgOceanGrad" cx="60%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#0c1d36" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#081426" stopOpacity="0.98" />
          <stop offset="70%" stopColor="#050c18" stopOpacity="1" />
          <stop offset="100%" stopColor="#02060d" stopOpacity="1" />
        </radialGradient>

        {/* 5. Parchment Land Base (Uniform Warm Antique Parchment Ochre) */}
        <linearGradient id="rpgLandBaseGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#dfd1b2" />
          <stop offset="50%" stopColor="#dfd1b2" />
          <stop offset="100%" stopColor="#dfd1b2" />
        </linearGradient>

        {/* 6. South America Surrounding Landmass Fill */}
        <linearGradient id="rpgSouthAmericaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
