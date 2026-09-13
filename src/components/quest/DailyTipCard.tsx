import React from 'react';
import {
  Sparkles,
  CloudRain,
  Trees,
  Compass,
  Sun,
  Landmark,
} from 'lucide-react';
import { DailyTipCategory, DailyTipItem } from '../../data/dailyTipsData';

export const CATEGORY_META: Record<
  DailyTipCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string; badgeBg: string }
> = {
  clima: {
    label: 'Clima & Extremos',
    icon: CloudRain,
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
  },
  biodiversidade: {
    label: 'Biodiversidade Rara',
    icon: Trees,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  },
  geografia: {
    label: 'Geografia & Fronteiras',
    icon: Compass,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  },
  astrometria: {
    label: 'Astrometria & Sol',
    icon: Sun,
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  },
  cultura: {
    label: 'Cultura & Patrimônio',
    icon: Landmark,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  },
};

interface DailyTipCardProps {
  tip: DailyTipItem;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({ tip }) => {
  const currentMeta = CATEGORY_META[tip.category];
  const CategoryIcon = currentMeta.icon;

  return (
    <div
      id="card-dica-curiosidade"
      className="card-dica-curiosidade flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl bg-stone-800/40 border border-stone-700/50 p-4 sm:p-5"
    >
      {/* Metadados: Categoria, Estado e Agência */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            id="badge-curiosidade-categoria"
            className={`badge-curiosidade-categoria px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${currentMeta.badgeBg}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            {currentMeta.label}
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200">
            {tip.stateName} ({tip.stateId})
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700/60">
            Fonte: {tip.sourceAgency}
          </span>
        </div>
      </div>

      {/* Título Principal */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-stone-100">{tip.title}</h3>
        <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-1 leading-relaxed">
          {tip.fact}
        </p>
      </div>

      {/* Destaque "Você Sabia?" */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs sm:text-sm leading-relaxed flex gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>{tip.didYouKnow}</div>
      </div>

      {/* Aprofundamento Científico / Histórico */}
      <div className="text-xs text-stone-300 leading-relaxed space-y-1">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          Contexto & Dados Oficiais
        </div>
        <p>{tip.curiosityDepth}</p>
        <p className="text-[11px] text-stone-400 italic pt-1">
          Registro: {tip.sourceDetail}
        </p>
      </div>
    </div>
  );
};
