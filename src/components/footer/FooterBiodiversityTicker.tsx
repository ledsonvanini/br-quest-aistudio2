import React from 'react';
import { Leaf, Bird, Trees, ShieldAlert, Clock } from 'lucide-react';

interface FooterBiodiversityTickerProps {
  biodivTimeOnly: string;
}

export const FooterBiodiversityTicker: React.FC<FooterBiodiversityTickerProps> = ({
  biodivTimeOnly,
}) => {
  return (
    <div
      id="painel-biodiversidade-ticker-rodape"
      className="painel-biodiversidade-ticker-rodape flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs shadow-md animate-in fade-in duration-150 overflow-x-auto no-scrollbar shrink-0"
    >
      {/* Ícone Raiz Biodiversidade */}
      <div
        className="flex items-center text-emerald-300 shrink-0 cursor-default"
        title="Biodiversidade e Biomas do Brasil"
      >
        <Leaf className="w-4 h-4 text-emerald-400" />
      </div>

      <div className="h-3.5 w-px bg-emerald-500/30 shrink-0" />

      {/* Categorias Expressivas */}
      <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
        <span
          className="flex items-center gap-1 text-amber-300 cursor-default"
          title="Fauna Nativa dos Biomas Brasileiros"
        >
          <Bird className="w-3.5 h-3.5 text-amber-400" />
        </span>
        <span
          className="flex items-center gap-1 text-emerald-300 cursor-default"
          title="Flora e Espécies Vegetais"
        >
          <Trees className="w-3.5 h-3.5 text-emerald-400" />
        </span>
        <span
          className="flex items-center gap-1 text-rose-300 cursor-default"
          title="Espécies Protegidas SisCITES & ICMBio"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        </span>
      </div>

      <div className="h-3.5 w-px bg-emerald-500/30 shrink-0" />

      {/* Timestamp */}
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/90 border border-emerald-500/30 text-emerald-200 font-mono text-[10px] shrink-0"
        title="Catálogo de Biodiversidade • Horário de Brasília (UTC-3)"
      >
        <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="font-semibold text-emerald-100">{biodivTimeOnly}</span>
      </div>
    </div>
  );
};
