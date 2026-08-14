import React from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';

/**
 * Hand-drawn style Antique RPG Cartographic Embellishments:
 * - Hand-crafted Compass Rose (Rosa dos Ventos em ouro e bronze envelhecido)
 * - Latin Inscriptions ("TERRA BRASILIS", "OCEANVS ATLANTICVS")
 * - Nautical Rhumb Lines & Caravel Ship Silhouette
 */
export const AntiqueCartographyDecor: React.FC = () => {
  return (
    <g id="antique-cartography-decor" className="pointer-events-none select-none">
      {/* 1. Classical Compass Rose in Atlantic Ocean (Coordinates ~ x: 1950, y: 880) */}
      <g transform="translate(1980, 860) scale(1.1)" opacity={0.85}>
        {/* Outer Ring */}
        <circle r="75" fill="none" stroke="#d97706" strokeWidth="2.5" strokeOpacity="0.4" />
        <circle r="82" fill="none" stroke="#92400e" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
        <circle r="68" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.3" />

        {/* 16-point Compass Star */}
        {/* Cardinal North/South/East/West Points */}
        {/* North Point (Golden Spear) */}
        <path d="M 0 0 L -12 -20 L 0 -80 L 12 -20 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.2" />
        <path d="M 0 0 L 0 -80 L 12 -20 Z" fill="#fbbf24" opacity="0.9" />

        {/* South Point */}
        <path d="M 0 0 L -10 18 L 0 65 L 10 18 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
        <path d="M 0 0 L 0 65 L 10 18 Z" fill="#d97706" opacity="0.8" />

        {/* East Point */}
        <path d="M 0 0 L 18 -10 L 65 0 L 18 10 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
        <path d="M 0 0 L 65 0 L 18 10 Z" fill="#d97706" opacity="0.8" />

        {/* West Point */}
        <path d="M 0 0 L -18 -10 L -65 0 L -18 10 Z" fill="#78350f" stroke="#d97706" strokeWidth="1.2" />
        <path d="M 0 0 L -65 0 L -18 -10 Z" fill="#d97706" opacity="0.8" />

        {/* Diagonal Intermediate Points */}
        <path d="M 0 0 L -6 -16 L -40 -40 L -16 -6 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
        <path d="M 0 0 L 6 -16 L 40 -40 L 16 -6 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
        <path d="M 0 0 L -6 16 L -40 40 L -16 6 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
        <path d="M 0 0 L 6 16 L 40 40 L 16 6 Z" fill="#451a03" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />

        {/* Center Jewel */}
        <circle r="12" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
        <circle r="6" fill="#fbbf24" />
        <circle r="2.5" fill="#ffffff" />

        {/* Cardinal Letter Labels */}
        <text x="0" y="-90" textAnchor="middle" fill="#fde047" fontSize="16" fontFamily="serif" fontWeight="bold" letterSpacing="1">
          N
        </text>
        <text x="0" y="85" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
          S
        </text>
        <text x="80" y="5" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
          L
        </text>
        <text x="-80" y="5" textAnchor="middle" fill="#fcd34d" fontSize="13" fontFamily="serif" fontWeight="bold">
          O
        </text>
      </g>

      {/* 2. Antique Latin Ocean Banner */}
      <g transform="translate(1960, 680) rotate(-12)" opacity={0.65}>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="24"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing="8"
          fillOpacity="0.45"
          stroke="#0284c7"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        >
          OCEANVS ATLANTICVS
        </text>
      </g>

      {/* 3. Renaissance Explorer Caravel Ship in Atlantic Waters */}
      <g transform="translate(1930, 480) scale(0.65)" opacity={0.6}>
        {/* Hull */}
        <path
          d="M 10 30 Q 35 48 70 42 Q 85 36 95 18 L 80 18 Q 50 25 15 15 Z"
          fill="#78350f"
          stroke="#d97706"
          strokeWidth="1.5"
        />
        {/* Main Mast & Billowing Sails */}
        <line x1="45" y1="32" x2="45" y2="-30" stroke="#451a03" strokeWidth="2.5" />
        <path d="M 45 -25 Q 65 -15 45 -5 Q 25 -15 45 -25" fill="#fef3c7" stroke="#92400e" strokeWidth="1" />
        <path d="M 45 -3 Q 70 12 45 25 Q 20 12 45 -3" fill="#fffbeb" stroke="#92400e" strokeWidth="1" />
        {/* Fore Mast */}
        <line x1="25" y1="26" x2="25" y2="-12" stroke="#451a03" strokeWidth="2" />
        <path d="M 25 -10 Q 40 -2 25 10 Q 12 -2 25 -10" fill="#fef3c7" stroke="#92400e" strokeWidth="1" />
        {/* Order of Christ Cross on Main Sail */}
        <path d="M 43 8 L 47 8 L 47 16 L 43 16 Z M 39 11 L 51 11 L 51 13 L 39 13 Z" fill="#dc2626" />
        {/* Sea Waves under the keel */}
        <path d="M 5 36 Q 25 45 45 36 Q 65 45 85 36 Q 105 45 115 38" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>

      {/* 4. Imperial Map Title Banner in Upper Northwest */}
      <g transform="translate(340, 140)" opacity={0.85}>
        <rect
          x="-160"
          y="-30"
          width="320"
          height="58"
          rx="10"
          fill="#0f172a"
          fillOpacity="0.8"
          stroke="#b45309"
          strokeWidth="2"
        />
        <rect
          x="-156"
          y="-26"
          width="312"
          height="50"
          rx="8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="13"
          fontFamily="serif"
          fontWeight="bold"
          letterSpacing="3"
        >
          REINO DOS GUARDIÕES
        </text>
        <text
          x="0"
          y="15"
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize="17"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing="4"
        >
          TERRA BRASILIS
        </text>
      </g>
    </g>
  );
};
