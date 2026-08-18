import React from 'react';

/**
 * Procedural Antique Parchment & Paper Texture Filters
 * Provides authentic 16th-century handmade paper fibers, tea-stained watercolor blend,
 * antique ink bleeding, tactile relief folds, and aged sepia portulano tones.
 */
export const ParchmentTextureFilter: React.FC = () => {
  return (
    <svg className="filtro-pergaminho-svg absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* 1. Authentic Antique Parchment Paper Texture with Folds & Aging */}
        <filter id="rpgParchmentPaper" x="-10%" y="-10%" width="120%" height="120%">
          {/* Base Paper Fibers */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.05"
            numOctaves="6"
            stitchTiles="stitch"
            result="fineFibers"
          />
          {/* Organic Stains and Aging Patches */}
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008 0.012"
            numOctaves="4"
            stitchTiles="stitch"
            result="coarseStains"
          />
          {/* Merge Fibers & Stains */}
          <feComposite in="fineFibers" in2="coarseStains" operator="arithmetic" k1="0.5" k2="0.6" k3="0.2" k4="0" result="combinedPaperNoise" />
          
          {/* Antique Ochre & Sepia Tone Mapping */}
          <feColorMatrix
            type="matrix"
            values="
              0.45 0 0 0 0.82
              0 0.38 0 0 0.72
              0 0 0.28 0 0.52
              0 0 0 1 0"
            in="combinedPaperNoise"
            result="paperTone"
          />
          
          {/* Tactile Surface Light Relief */}
          <feDiffuseLighting
            in="combinedPaperNoise"
            lightingColor="#fcf4e4"
            surfaceScale="3.2"
            diffuseConstant="1.2"
            result="paperRelief"
          >
            <feDistantLight azimuth="55" elevation="52" />
          </feDiffuseLighting>

          <feBlend mode="multiply" in="SourceGraphic" in2="paperRelief" result="blendedGraphic" />
          <feComposite operator="in" in="blendedGraphic" in2="SourceGraphic" />
        </filter>

        {/* 2. Tactile 3D Paper Emboss & Inked Edge Drop Shadow */}
        <filter id="rpgStateBorderShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#2d1705"
            floodOpacity="0.75"
          />
        </filter>

        {/* 3. Golden Mana Glow for Selected / Completed States */}
        <filter id="rpgGoldenAura" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#d97706" floodOpacity="0.85" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="coloredGlow" />
          <feMerge>
            <feMergeNode in="coloredGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 4. Ocean Depth Cartographic Gradient for Deep Mode */}
        <radialGradient id="rpgOceanGrad" cx="60%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#0c1d36" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#081426" stopOpacity="0.98" />
          <stop offset="70%" stopColor="#050c18" stopOpacity="1" />
          <stop offset="100%" stopColor="#02060d" stopOpacity="1" />
        </radialGradient>

        {/* 5. Authentic Antique Parchment Ocean Gradient (Carta Náutica Clássica) */}
        <radialGradient id="rpgParchmentOceanGrad" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#f5ecd5" />
          <stop offset="40%" stopColor="#eedcb7" />
          <stop offset="75%" stopColor="#dfcaa0" />
          <stop offset="100%" stopColor="#c8ad7f" />
        </radialGradient>

        {/* 6. Parchment Land Base (Warm Antique Sepia & Ochre) */}
        <linearGradient id="rpgLandParchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faebd7" />
          <stop offset="35%" stopColor="#f3e0bc" />
          <stop offset="70%" stopColor="#e5cca0" />
          <stop offset="100%" stopColor="#d3b584" />
        </linearGradient>

        {/* 7. South America Landmass Parchment Fill */}
        <linearGradient id="rpgSouthAmericaParchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8d5b5" />
          <stop offset="50%" stopColor="#dec49e" />
          <stop offset="100%" stopColor="#cdaf85" />
        </linearGradient>
      </defs>
    </svg>
  );
};

