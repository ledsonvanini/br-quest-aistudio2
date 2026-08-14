import React from 'react';

interface ProceduralOceanCanvasProps {
  isPlayingAnimation?: boolean;
}

export const ProceduralOceanCanvas: React.FC<ProceduralOceanCanvasProps> = () => {
  return (
    <div
      className="container-oceano-infinito absolute -inset-[250%] pointer-events-none overflow-hidden select-none"
      style={{
        width: '600%',
        height: '600%',
        left: '-250%',
        top: '-250%',
      }}
    >
      {/* 1. Deep Abyssal Ocean Radial Base (Infinite Natural Gradient) */}
      <div
        className="oceano-profundo-base absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, #08172c 0%, #040d1a 38%, #020710 70%, #010308 100%)',
        }}
      />

      {/* 2. Soft Atlantic Maritime Radians and Subtle Compass Radials without Any Grid Graticules */}
      <svg
        className="radial-nautico-atlantico absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="oceanRadialRayGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Tactical Nautical Circles in Atlantic */}
        <g transform="translate(4800, 3200)" opacity="0.3">
          <circle cx="0" cy="0" r="300" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.2" />
          <circle cx="0" cy="0" r="700" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 12" strokeOpacity="0.15" />
          <circle cx="0" cy="0" r="1300" fill="none" stroke="#38bdf8" strokeWidth="0.4" strokeDasharray="8 16" strokeOpacity="0.1" />

          {/* Navigation Rhumb Ray Lines */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => (
            <line
              key={`rhumb-ray-${deg}`}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 2200}
              y2={Math.sin((deg * Math.PI) / 180) * 2200}
              stroke="url(#oceanRadialRayGrad)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
            />
          ))}
        </g>
      </svg>

      {/* 3. Bathymetric Continental Shelf Glow (Soft Marine Turquoise around South America & Brazil) */}
      <div
        className="halo-plataforma-continental absolute pointer-events-none"
        style={{
          left: '46%',
          top: '46%',
          width: '1800px',
          height: '1400px',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(ellipse 55% 50% at 54% 48%, rgba(14, 165, 233, 0.12) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 80%)',
          filter: 'blur(30px)',
        }}
      />

      {/* 4. Ambient Caustic Marine Wave Shimmer (GPU Accelerated Animation) */}
      <div
        className="ondulacao-marinha-gpu absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 35% 25% at 52% 48%, rgba(56, 189, 248, 0.12), transparent 70%), radial-gradient(ellipse 45% 35% at 46% 54%, rgba(14, 165, 233, 0.06), transparent 75%)',
        }}
      />
    </div>
  );
};
