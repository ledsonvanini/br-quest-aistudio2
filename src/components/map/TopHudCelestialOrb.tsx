import React, { useEffect, useState } from 'react';
import { getBrasiliaCelestialEphemeris, CelestialEphemeris } from '../../services/astronomyService';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface TopHudCelestialOrbProps {
  enabled?: boolean;
  timeOverride?: 'auto' | 'day' | 'night';
}

export const TopHudCelestialOrb: React.FC<TopHudCelestialOrbProps> = ({
  enabled = true,
  timeOverride = 'auto',
}) => {
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() =>
    getBrasiliaCelestialEphemeris(timeOverride)
  );

  useEffect(() => {
    const update = () => {
      setEphemeris(getBrasiliaCelestialEphemeris(timeOverride));
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [timeOverride]);

  if (!enabled) return null;

  const isNight = ephemeris.isNight;
  const intensity = ephemeris.sunIntensity || 0.85;

  return (
    <div
      id="container-astro-celeste-hud-topo"
      className="container-astro-celeste-hud-topo fixed top-0 right-10 sm:right-24 md:right-36 z-30 pointer-events-none select-none flex flex-col items-center overflow-visible"
      aria-hidden="true"
    >
      {/* 1. DIFUSÃO ATMOSFÉRICA / GLOW ORGÂNICO EXPANSIVO (Suave e sem cortes rígidos) */}
      <div
        className="absolute -top-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: isNight
            ? 'radial-gradient(circle at 50% 20%, rgba(147, 197, 253, 0.28) 0%, rgba(96, 165, 250, 0.12) 35%, rgba(30, 58, 138, 0.04) 65%, transparent 80%)'
            : `radial-gradient(circle at 50% 20%, rgba(254, 240, 138, ${0.42 * intensity}) 0%, rgba(251, 191, 36, ${0.22 * intensity}) 35%, rgba(245, 158, 11, ${0.06 * intensity}) 65%, transparent 85%)`,
          filter: 'blur(16px)',
        }}
      />

      {/* 2. FEIXES VOLUMÉTRICOS SUAVES (Subtle Ethereal Ambient Light Dusting) */}
      {!isNight && (
        <div
          className="absolute -top-8 w-72 sm:w-88 h-96 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-1000"
          style={{
            background: 'conic-gradient(from 150deg at 50% 0%, transparent 0deg, rgba(254, 240, 138, 0.22) 15deg, transparent 35deg, rgba(251, 191, 36, 0.18) 55deg, transparent 75deg, rgba(254, 240, 138, 0.25) 90deg, transparent 110deg)',
            filter: 'blur(14px)',
            transformOrigin: 'top center',
          }}
        />
      )}

      {/* 3. DISCO CELESTE GRUDADO NO TOPO DA HUD (Apenas parte superior visível emergindo sutilmente) */}
      <div className="relative -top-4 sm:-top-5 flex flex-col items-center">
        {isNight ? (
          /* LUA NOTURNA ELEGANTE PEVIANDO NO TOPO */
          <div className="relative group pointer-events-auto cursor-default flex flex-col items-center">
            {/* Halo Pulsante Lunar */}
            <div className="absolute -inset-2 rounded-full bg-blue-400/25 blur-md animate-pulse" />
            
            {/* Disco da Lua 3D */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-blue-200/50 shadow-[0_0_24px_rgba(191,219,254,0.6)] flex items-center justify-center relative overflow-hidden transition-transform duration-700 hover:scale-105"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 45%, #94a3b8 80%, #64748b 100%)',
              }}
            >
              {/* Cráteres Lunares Sutis */}
              <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-slate-500/20 blur-[0.5px]" />
              <div className="absolute bottom-3 right-4 w-4 h-4 rounded-full bg-slate-600/25 blur-[0.5px]" />
              <div className="absolute top-6 right-2 w-2 h-2 rounded-full bg-slate-500/20 blur-[0.5px]" />

              {/* Sombra da Fase Lunar */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(15, 23, 42, 0.75) 100%)',
                }}
              />
            </div>

            {/* Micro Badge Informativo da Efeméride */}
            <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-400/30 text-[9px] font-sans text-blue-200 shadow-md">
              <Moon className="w-2.5 h-2.5 text-blue-300 shrink-0" />
              <span>{ephemeris.moonPhaseName}</span>
              <span className="text-blue-400 font-mono text-[8px]">({ephemeris.moonIlluminationPercent}%)</span>
            </div>
          </div>
        ) : (
          /* SOL RADIANTE DIURNO COM CORONA SUAVE */
          <div className="relative group pointer-events-auto cursor-default flex flex-col items-center">
            {/* Halo Pulsante Solar */}
            <div
              className="absolute -inset-3 rounded-full bg-amber-400/30 blur-lg transition-transform duration-1000"
              style={{
                transform: `scale(${1 + intensity * 0.15})`,
              }}
            />

            {/* Disco Solar */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-amber-200/80 shadow-[0_0_32px_rgba(251,191,36,0.85)] flex items-center justify-center relative overflow-hidden transition-transform duration-700 hover:scale-105"
              style={{
                background: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #fef08a 30%, #f59e0b 70%, #d97706 100%)',
              }}
            >
              {/* Flares anelados suaves internos */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-25" />
            </div>

            {/* Micro Badge Informativo da Efeméride */}
            <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[9px] font-sans text-amber-200 shadow-md">
              <Sun className="w-2.5 h-2.5 text-amber-300 shrink-0 animate-spin-slow" />
              <span className="font-medium">Sol de Brasília</span>
              <span className="text-amber-400 font-mono text-[8px]">UV {ephemeris.uvIndex}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
