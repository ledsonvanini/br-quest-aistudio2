import React from 'react';

export interface MapCartographicDefsProps {
  brazilBoundaryCombinedPath: string;
}

export const MapCartographicDefs: React.FC<MapCartographicDefsProps> = ({
  brazilBoundaryCombinedPath,
}) => {
  return (
    <defs>
      <clipPath id="brazil-boundary-clip">
        <path d={brazilBoundaryCombinedPath} />
      </clipPath>

      <linearGradient id="saContinentEarthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#223249" />
        <stop offset="40%" stopColor="#1b283d" />
        <stop offset="75%" stopColor="#152030" />
        <stop offset="100%" stopColor="#101926" />
      </linearGradient>

      <linearGradient id="neighborHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b5275" />
        <stop offset="100%" stopColor="#23354d" />
      </linearGradient>

      <filter id="stateReliefShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#010409" floodOpacity="0.75" />
      </filter>
    </defs>
  );
};
