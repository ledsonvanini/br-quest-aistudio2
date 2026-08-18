import React from 'react';

interface ProceduralOceanCanvasProps {
  isPlayingAnimation?: boolean;
  isParchmentMode?: boolean;
}

export const ProceduralOceanCanvas: React.FC<ProceduralOceanCanvasProps> = ({
  isParchmentMode = false,
}) => {
  return (
    <div
      className="container-oceano-game-engine absolute pointer-events-none overflow-visible select-none"
      style={{
        width: 4000,
        height: 3000,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) translateZ(-10px)',
        zIndex: 0,
        background: isParchmentMode
          ? 'radial-gradient(ellipse 65% 60% at 50% 50%, #fbf2df 0%, #eedbb8 40%, #dfc59b 70%, #b08f58 100%)'
          : 'radial-gradient(ellipse 65% 60% at 50% 48%, #030e24 0%, #020b1c 45%, #020814 75%, #01050e 100%)',
      }}
    >
      {/* Sutil textura náutica em CSS acelerado por hardware (zero custo de GPU) */}
      {!isParchmentMode && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      )}
    </div>
  );
};
