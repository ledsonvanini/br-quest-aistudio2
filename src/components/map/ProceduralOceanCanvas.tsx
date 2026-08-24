import React, { useMemo } from 'react';

interface ProceduralOceanCanvasProps {
  isPlayingAnimation?: boolean;
  isParchmentMode?: boolean;
}

// Procedural seamless fine paper grain noise (clean, neutral, non-distorting)
export const FINE_PAPER_NOISE_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="finePaperNoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(%23finePaperNoise)" opacity="0.4"/></svg>`;

export const SEAMLESS_NOISE_SVG = FINE_PAPER_NOISE_SVG;

/**
 * ProceduralOceanCanvas
 * South Atlantic ocean backdrop with radial gradient transition
 * and subtle, non-intrusive paper grain overlay.
 */
export const ProceduralOceanCanvas: React.FC<ProceduralOceanCanvasProps> = ({
  isParchmentMode = false,
}) => {
  const oceanGradient = useMemo(() => {
    if (isParchmentMode) {
      return 'radial-gradient(circle 2200px at 50% 50%, #fbf2df 0%, #eedbb8 25%, #dfc59b 50%, #b08f58 75%, #8c6a38 100%)';
    }
    return 'radial-gradient(circle 2400px at 50% 50%, #0e568e 0%, #0a3d68 22%, #062846 45%, #03172b 70%, #020d1c 90%)';
  }, [isParchmentMode]);

  return (
    <div
      className="container-oceano-game-engine absolute pointer-events-none overflow-visible select-none"
      style={{
        width: 12000,
        height: 9000,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) translateZ(-10px)',
        zIndex: 0,
        background: oceanGradient,
      }}
    >
      {/* 1. Subtle Fine Paper Grain Noise (Overlay Blend, clean & neutral) */}
      <div
        className="camada-ruido-grao-oceano absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
        style={{
          backgroundImage: `url("${FINE_PAPER_NOISE_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* 2. Sutil Textura de Profundidade Batimétrica Náutica */}
      {!isParchmentMode && (
        <div
          className="absolute inset-0 opacity-12 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      )}
    </div>
  );
};


