import React from 'react';

/**
 * High-performance SVG Filters and Gradients for procedural terrain,
 * paper relief texture, 50% inner shadow, contour drop shadow and imperial glows.
 * 100% vector and procedural - Zero external PNG/JPG textures needed.
 */
export const ProceduralTerrainFilter: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Procedural Parchment & Topographic Terrain Texture */}
        <filter id="proceduralTerrainRelief" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#ffffff"
            surfaceScale="1.8"
            result="light"
          >
            <feDistantLight azimuth="55" elevation="65" />
          </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" in2="light" result="textured" />
          <feComposite operator="in" in="textured" in2="SourceGraphic" />
        </filter>

        {/* 50% Contour Drop Shadow for State Elevation */}
        <filter id="stateDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>

        {/* 50% Inner Shadow for Tactile 3D Extrusion */}
        <filter id="stateInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="linear" slope="0.7" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feOffset dx="0" dy="5" />
          <feComposite operator="out" in2="SourceGraphic" result="inverse" />
          <feFlood floodColor="#000000" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in2="inverse" result="shadow" />
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>

        {/* Imperial Gold Glow for Active / Hovered States */}
        <filter id="imperialGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="1.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tactical Nautical Grid Gradients */}
        <linearGradient id="oceanGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.18" />
        </linearGradient>

        {/* South America Continental Context Gradient */}
        <linearGradient id="continentalLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#090d16" stopOpacity="0.85" />
        </linearGradient>
      </defs>
    </svg>
  );
};
