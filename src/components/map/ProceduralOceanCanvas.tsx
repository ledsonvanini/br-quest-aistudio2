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
        width: 7000,
        height: 5000,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) translateZ(-10px)',
        zIndex: 0,
        background: isParchmentMode
          ? 'radial-gradient(ellipse 70% 65% at 50% 50%, #fbf2df 0%, #eedbb8 45%, #dfc59b 75%, #b08f58 100%)'
          : 'radial-gradient(ellipse 75% 70% at 50% 48%, #031526 0%, #020e1d 40%, #020a16 70%, #01060f 100%)',
      }}
    >
      {/* Sutil textura náutica e grade batimétrica procedural */}
      {!isParchmentMode && (
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.18) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      )}
    </div>
  );
};
