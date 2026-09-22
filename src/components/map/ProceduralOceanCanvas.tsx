import React, { useMemo } from 'react';
import { AppMainMode } from '../../types';
import { OceanDeepFractalCanvas } from './OceanDeepFractalCanvas';

interface ProceduralOceanCanvasProps {
  isPlayingAnimation?: boolean;
  isParchmentMode?: boolean;
  isBiodiversityMode?: boolean;
  isMusicalMode?: boolean;
  isTerritoryMode?: boolean;
  isClimateMode?: boolean;
  isElNinoActive?: boolean;
  elNinoPhase?: 'El Niño' | 'La Niña' | 'Neutro';
  mode?: AppMainMode;
}

// Procedural seamless fine paper grain noise (clean, neutral, non-distorting)
export const FINE_PAPER_NOISE_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="finePaperNoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(%23finePaperNoise)" opacity="0.4"/></svg>`;

export const SEAMLESS_NOISE_SVG = FINE_PAPER_NOISE_SVG;

/**
 * ProceduralOceanCanvas
 * South Atlantic ocean backdrop with radial gradient transition
 * and subtle, non-intrusive paper grain overlay tailored to each mode.
 */
export const ProceduralOceanCanvas: React.FC<ProceduralOceanCanvasProps> = ({
  isPlayingAnimation = true,
  isParchmentMode = false,
  isBiodiversityMode = false,
  isMusicalMode = false,
  isTerritoryMode = false,
  isClimateMode = false,
  isElNinoActive = false,
  elNinoPhase = 'El Niño',
  mode,
}) => {
  const currentMode: AppMainMode = useMemo(() => {
    if (mode) return mode;
    if (isBiodiversityMode) return 'biodiversidade';
    if (isMusicalMode) return 'musicalidades';
    if (isClimateMode) return 'clima';
    return 'aventura';
  }, [mode, isBiodiversityMode, isMusicalMode, isClimateMode]);

  const oceanGradient = useMemo(() => {
    if (isTerritoryMode) {
      // Oceano Cartográfico Técnico Exclusivo: tons índigo e estuarinos com batimetria nítida
      return 'radial-gradient(circle 3400px at 50% 50%, #062340 0%, #041a32 24%, #021223 52%, #010a14 85%)';
    }
    if (isClimateMode && (isElNinoActive || elNinoPhase)) {
      if (elNinoPhase === 'El Niño') {
        // El Niño: Aquecimento Anômalo do Oceano Equatorial (TSM Positiva / NOAA)
        return 'radial-gradient(circle 3600px at 50% 50%, #17385c 0%, #102744 26%, #0b1a2e 54%, #060e1b 85%)';
      }
      if (elNinoPhase === 'La Niña') {
        // La Niña: Resfriamento Anômalo do Oceano (Águas Polares Turquesa / NOAA)
        return 'radial-gradient(circle 3600px at 50% 50%, #063d54 0%, #042939 26%, #021c27 54%, #010c12 85%)';
      }
    }
    if (isParchmentMode) {
      return 'radial-gradient(circle 2200px at 50% 50%, #fbf2df 0%, #eedbb8 25%, #dfc59b 50%, #b08f58 75%, #8c6a38 100%)';
    }
    if (isBiodiversityMode) {
      // Oceano com tons esmeralda-marinho e recifes costeiros profundos
      return 'radial-gradient(circle 2400px at 50% 50%, #0d4a46 0%, #083b38 22%, #052c29 45%, #031d1b 70%, #010f0e 90%)';
    }
    if (isMusicalMode) {
      // Oceano Atlântico Noturno / Safira Profunda com ressonância acústica suave
      return 'radial-gradient(circle 2600px at 55% 45%, #0e243d 0%, #091a2e 25%, #061120 52%, #030a14 78%, #010408 100%)';
    }
    return 'radial-gradient(circle 3800px at 50% 50%, #0c487c 0%, #072a4e 25%, #03172e 55%, #010d1c 85%)';
  }, [isBiodiversityMode, isMusicalMode, isParchmentMode, isTerritoryMode, isClimateMode, isElNinoActive, elNinoPhase]);

  return (
    <div
      className="container-oceano-game-engine absolute pointer-events-none overflow-visible select-none"
      style={{
        width: 14000,
        height: 10000,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) translateZ(-10px)',
        zIndex: 0,
        background: oceanGradient,
      }}
    >
      {/* 0. Camada Base: Shader Fractal do Oceano Profundo (14.000 x 10.000px, 100% da Área Navegável) */}
      {(!isParchmentMode || isTerritoryMode) && (
        <OceanDeepFractalCanvas
          mode={currentMode}
          isTerritoryMode={isTerritoryMode}
          waveSpeed={0.72}
          isPlayingAnimation={isPlayingAnimation}
        />
      )}

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
      {!isParchmentMode && !isMusicalMode && (
        <div
          className="absolute inset-0 opacity-12 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      )}

      {/* 3. Textura Harmônica e Acústica de Ondas Sonoras Exclusiva do Modo Musicalidades */}
      {isMusicalMode && (
        <svg
          id="camada-textura-mar-musical"
          className="camada-textura-mar-musical absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Padrão de Ondas Sonoras Senoidais no Mar com compassos rítmicos */}
            <pattern
              id="pattern-ondas-sonoras-mar"
              width="200"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              {/* Linha harmônica superior em tom dourado/âmbar acústico (432Hz) */}
              <path
                d="M 0 25 C 50 5, 50 45, 100 25 C 150 5, 150 45, 200 25"
                fill="none"
                stroke="rgba(245, 158, 11, 0.16)"
                strokeWidth="1.2"
                strokeDasharray="5 3"
              />
              {/* Onda senoidal principal em azul safira acústico */}
              <path
                d="M 0 50 C 50 30, 50 70, 100 50 C 150 30, 150 70, 200 50"
                fill="none"
                stroke="rgba(56, 189, 248, 0.14)"
                strokeWidth="1.4"
              />
              {/* Linha harmônica grave em tom âmbar suave */}
              <path
                d="M 0 75 C 50 60, 50 90, 100 75 C 150 60, 150 90, 200 75"
                fill="none"
                stroke="rgba(245, 158, 11, 0.11)"
                strokeWidth="1.0"
              />
              {/* Marcadores de nós harmônicos e pulso de áudio */}
              <circle cx="100" cy="25" r="2.2" fill="rgba(251, 191, 36, 0.3)" />
              <circle cx="200" cy="50" r="2.5" fill="rgba(56, 189, 248, 0.3)" />
              <circle cx="100" cy="75" r="1.8" fill="rgba(245, 158, 11, 0.25)" />
            </pattern>

            {/* Difusão radial de irradiação acústica a partir da costa leste brasileira */}
            <radialGradient id="grad-difusao-acustica-mar" cx="58%" cy="48%" r="55%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.22)" />
              <stop offset="25%" stopColor="rgba(56, 189, 248, 0.14)" />
              <stop offset="60%" stopColor="rgba(14, 165, 233, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Fundo padronizado de ondas senoidais rítmicas */}
          <rect
            width="100%"
            height="100%"
            fill="url(#pattern-ondas-sonoras-mar)"
            opacity="0.9"
          />

          {/* Ressonância concêntrica de difusão musical sobre o Atlântico Sul */}
          <g transform="translate(6960, 4320)" opacity="0.5">
            {[450, 900, 1400, 1950, 2550, 3200, 3900].map((radius, idx) => (
              <circle
                key={`onda-circulo-som-${radius}`}
                r={radius}
                fill="none"
                stroke={idx % 2 === 0 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(56, 189, 248, 0.18)'}
                strokeWidth={idx % 2 === 0 ? 1.5 : 1.1}
                strokeDasharray={idx % 2 === 0 ? '14 10 4 10' : '10 8'}
              />
            ))}
          </g>

          {/* Brilho radial de propagação acústica costeira */}
          <rect
            width="100%"
            height="100%"
            fill="url(#grad-difusao-acustica-mar)"
            style={{ mixBlendMode: 'screen' }}
            opacity="0.75"
          />
        </svg>
      )}

      {/* 4. Textura Cartográfica Técnica Náutica e Linhas de Grade de Estuários Exclusiva do Modo Território */}
      {isTerritoryMode && (
        <svg
          id="camada-textura-mar-territorio"
          className="camada-textura-mar-territorio absolute inset-0 w-full h-full pointer-events-none opacity-25 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pattern-grade-cartografica-mar"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 120 0 L 0 0 0 120"
                fill="none"
                stroke="rgba(6, 182, 212, 0.25)"
                strokeWidth="0.8"
                strokeDasharray="4 4"
              />
              <circle cx="0" cy="0" r="1.5" fill="rgba(6, 182, 212, 0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-grade-cartografica-mar)" />
        </svg>
      )}
    </div>
  );
};


