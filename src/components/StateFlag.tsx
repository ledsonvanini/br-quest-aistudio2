import React from 'react';
import * as Flags from 'br-state-flags';

interface StateFlagProps {
  uf: string;
  className?: string;
  alt?: string;
}

// Maps UF to the SVG Flag Component from br-state-flags
const FLAG_COMPONENTS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  AC: Flags.AC,
  AL: Flags.AL,
  AP: Flags.AP,
  AM: Flags.AM,
  BA: Flags.BA,
  CE: Flags.CE,
  DF: Flags.DF,
  ES: Flags.ES,
  GO: Flags.GO,
  MA: Flags.MA,
  MT: Flags.MT,
  MS: Flags.MS,
  MG: Flags.MG,
  PA: Flags.PA,
  PB: Flags.PB,
  PR: Flags.PR,
  PE: Flags.PE,
  PI: Flags.PI,
  RJ: Flags.RJ,
  RN: Flags.RN,
  RO: Flags.RO,
  RR: Flags.RR,
  RS: Flags.RS,
  SC: Flags.SC,
  SP: Flags.SP,
  SE: Flags.SE,
  TO: Flags.TO,
};

export const StateFlag: React.FC<StateFlagProps> = ({ uf, className = 'w-full h-full object-cover', alt }) => {
  const upperUF = uf.toUpperCase();
  const FlagComp = FLAG_COMPONENTS[upperUF];

  if (FlagComp) {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`} title={alt || `Bandeira de ${upperUF}`}>
        <FlagComp
          className="w-full h-full"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid slice"
        />
      </div>
    );
  }

  // Fallback if UF not found
  return (
    <div className={`flex items-center justify-center bg-slate-800 text-amber-300 font-mono font-bold ${className}`}>
      {upperUF}
    </div>
  );
};

export default StateFlag;
