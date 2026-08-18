import React from 'react';

interface AntiqueCartographyDecorProps {
  isParchmentMode?: boolean;
}

/**
 * Hand-drawn style Antique RPG Cartographic Embellishments:
 * - Hand-crafted Renaissance Compass Rose (Rosa dos Ventos em ouro e bronze envelhecido)
 * - Latin Inscriptions ("TERRA BRASILIS", "OCEANVS ATLANTICVS")
 * - Nautical Rhumb Lines, Sea Monster ("Serpens Marina") & Caravel Ship
 */
export const AntiqueCartographyDecor: React.FC<AntiqueCartographyDecorProps> = ({
  isParchmentMode = false,
}) => {
  return (
    <g id="antique-cartography-decor" className="decoracao-cartografia-antiga pointer-events-none select-none">
      {/* 1. Antique Latin Ocean Banner */}
      <g transform="translate(1960, 680) rotate(-12)" opacity={isParchmentMode ? 0.85 : 0.65}>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill={isParchmentMode ? '#78350f' : '#38bdf8'}
          fontSize="24"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing="8"
          fillOpacity={isParchmentMode ? 0.75 : 0.45}
          stroke={isParchmentMode ? '#451a03' : '#0284c7'}
          strokeWidth="0.5"
          strokeOpacity={isParchmentMode ? 0.6 : 0.3}
        >
          OCEANVS ATLANTICVS
        </text>
      </g>

      {/* 2. Renaissance Compass Rose in Ocean (East of Brazil) */}
      <g transform="translate(1900, 920)" opacity={isParchmentMode ? 0.85 : 0.5}>
        <circle
          cx="0"
          cy="0"
          r="48"
          fill={isParchmentMode ? '#faebd7' : '#0f172a'}
          fillOpacity="0.8"
          stroke={isParchmentMode ? '#92400e' : '#b45309'}
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="0"
          r="42"
          fill="none"
          stroke={isParchmentMode ? '#d97706' : '#fbbf24'}
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        {/* Cardinal Points */}
        {/* North Point */}
        <polygon points="0,-46 7,-10 0,0" fill="#dc2626" />
        <polygon points="0,-46 -7,-10 0,0" fill="#991b1b" />
        {/* South Point */}
        <polygon points="0,46 7,10 0,0" fill="#451a03" />
        <polygon points="0,46 -7,10 0,0" fill="#78350f" />
        {/* East Point */}
        <polygon points="46,0 10,7 0,0" fill="#d97706" />
        <polygon points="46,0 10,-7 0,0" fill="#b45309" />
        {/* West Point */}
        <polygon points="-46,0 -10,7 0,0" fill="#b45309" />
        <polygon points="-46,0 -10,-7 0,0" fill="#d97706" />
        {/* Center Golden Stud */}
        <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        <text
          x="0"
          y="-50"
          textAnchor="middle"
          fontSize="11"
          fontFamily="serif"
          fontWeight="bold"
          fill={isParchmentMode ? '#991b1b' : '#ef4444'}
        >
          N
        </text>
      </g>

      {/* 3. Renaissance Explorer Caravel Ship in Atlantic Waters */}
      <g transform="translate(1930, 480) scale(0.7)" opacity={isParchmentMode ? 0.85 : 0.6}>
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
        <path
          d="M 5 36 Q 25 45 45 36 Q 65 45 85 36 Q 105 45 115 38"
          fill="none"
          stroke={isParchmentMode ? '#92400e' : '#38bdf8'}
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
      </g>

      {/* 4. Renaissance Mythological Sea Monster (Serpens Marina) */}
      {isParchmentMode && (
        <g transform="translate(1820, 1180) scale(0.55)" opacity={0.65}>
          {/* Serpentine sea beast coils */}
          <path
            d="M 0 0 Q 30 -30 60 0 Q 90 30 120 0 Q 150 -30 180 0 Q 210 30 240 0"
            fill="none"
            stroke="#78350f"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Spikes / Fins */}
          <polygon points="60,-2 65,-18 70,-2" fill="#92400e" />
          <polygon points="120,2 125,18 130,2" fill="#92400e" />
          <polygon points="180,-2 185,-18 190,-2" fill="#92400e" />
          {/* Monster Head with jaws */}
          <path d="M -5 -2 Q -25 -20 -40 -5 Q -30 15 -5 2 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <circle cx="-25" cy="-6" r="2.5" fill="#fef08a" />
          {/* Label */}
          <text x="120" y="38" textAnchor="middle" fontSize="12" fontFamily="Georgia, serif" fontStyle="italic" fill="#78350f">
            Monstrum Marinum
          </text>
        </g>
      )}

      {/* 5. Imperial Map Title Banner in Upper Northwest */}
      <g transform="translate(340, 140)" opacity={isParchmentMode ? 0.95 : 0.85}>
        <rect
          x="-160"
          y="-30"
          width="320"
          height="58"
          rx="10"
          fill={isParchmentMode ? '#faebd7' : '#0f172a'}
          fillOpacity={isParchmentMode ? 0.95 : 0.8}
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
          stroke={isParchmentMode ? '#92400e' : '#fbbf24'}
          strokeWidth="1"
          strokeOpacity={isParchmentMode ? 0.6 : 0.4}
        />
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fill={isParchmentMode ? '#92400e' : '#fbbf24'}
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
          fill={isParchmentMode ? '#451a03' : '#e2e8f0'}
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

