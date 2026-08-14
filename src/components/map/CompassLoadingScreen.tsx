import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface CompassLoadingScreenProps {
  message?: string;
}

export const CompassLoadingScreen: React.FC<CompassLoadingScreenProps> = ({
  message = 'Traçando as Cartas Cartográficas do Brasil...',
}) => {
  return (
    <div
      id="container-loading-mapa"
      className="container-loading-bussola absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020611] text-amber-100 select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

      {/* Antique Nautical Compass */}
      <div className="palco-bussola relative flex items-center justify-center mb-6">
        {/* Outer Pulsing Aura Ring */}
        <div className="absolute -inset-6 rounded-full border border-amber-400/20 anim-ground-beacon-pulse pointer-events-none" />
        <div className="absolute -inset-12 rounded-full border border-yellow-500/10 anim-ground-beacon-pulse pointer-events-none" style={{ animationDelay: '0.8s' }} />

        {/* Outer Brass Dial Housing */}
        <div className="bussola-nautica relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-br from-amber-700 via-amber-950 to-slate-950 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex items-center justify-center">
          {/* Inner Graduated Dial Plate */}
          <div className="mostrador-graduado relative w-full h-full rounded-full bg-[#070e1b] border border-amber-500/40 flex items-center justify-center overflow-hidden">
            {/* Degree ticks & compass rose in SVG */}
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]"
              viewBox="0 0 200 200"
            >
              {/* Compass Rose Stars */}
              <polygon points="100,15 108,85 100,100" fill="#f59e0b" opacity="0.9" />
              <polygon points="100,15 92,85 100,100" fill="#b45309" opacity="0.8" />
              <polygon points="100,185 108,115 100,100" fill="#b45309" opacity="0.8" />
              <polygon points="100,185 92,115 100,100" fill="#f59e0b" opacity="0.9" />
              <polygon points="15,100 85,108 100,100" fill="#f59e0b" opacity="0.9" />
              <polygon points="15,100 85,92 100,100" fill="#b45309" opacity="0.8" />
              <polygon points="185,100 115,108 100,100" fill="#b45309" opacity="0.8" />
              <polygon points="185,100 115,92 100,100" fill="#f59e0b" opacity="0.9" />

              {/* Cardinal Points */}
              <text x="100" y="32" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold" fontFamily="serif">N</text>
              <text x="100" y="178" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="serif">S</text>
              <text x="175" y="104" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="serif">L</text>
              <text x="25" y="104" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="serif">O</text>

              {/* Dial Rings */}
              <circle cx="100" cy="100" r="92" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="2,3" opacity="0.6" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="#f59e0b" strokeWidth="0.75" opacity="0.4" />
            </svg>

            {/* Dynamic Oscillating Magnetic Needle */}
            <div className="agulha-magnetica absolute inset-0 flex items-center justify-center anim-needle-sway">
              <div className="relative w-2.5 h-28 sm:h-34 flex flex-col items-center justify-between">
                {/* North Crimson Pointer */}
                <div
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[48px] sm:border-b-[58px] border-b-rose-500 filter drop-shadow-[0_0_8px_#f43f5e]"
                />
                {/* Brass Center Rivet */}
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-200 border border-amber-100 shadow-[0_0_8px_#fde047] z-10" />
                {/* South Golden Pointer */}
                <div
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[48px] sm:border-t-[58px] border-t-amber-300 filter drop-shadow-[0_0_8px_#fcd34d]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lore & Status Typography */}
      <div className="text-center px-4 max-w-md flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-serif tracking-widest uppercase font-bold">
          <Compass className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
          <span>BR-QUEST CARTOGRAFIA</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        </div>

        <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100 tracking-wide">
          {message}
        </h3>

        <p className="text-xs text-amber-200/60 font-sans">
          Carregando relevos, malha vetorial dos 27 estados e insígnias heráldicas...
        </p>

        {/* Shimmering Progress Bar */}
        <div className="w-48 sm:w-64 h-1 mt-2 bg-slate-800 rounded-full overflow-hidden border border-amber-500/20">
          <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 w-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
