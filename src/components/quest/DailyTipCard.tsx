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
    label: 'Clima & Atmosfera',
    icon: CloudRain,
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/80 border-sky-500/50 text-sky-300',
  },
  biodiversidade: {
    label: 'Biodiversidade & Biomas',
    icon: Trees,
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
  },
  geografia: {
    label: 'Geografia & Território',
    icon: Compass,
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
  },
  astrometria: {
    label: 'Astrometria & Sol',
    icon: Sun,
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300',
  },
  cultura: {
    label: 'Cultura & Patrimônio',
    icon: Landmark,
    color: 'text-rose-300',
    badgeBg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
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
      className="card-dica-curiosidade flex-1 overflow-y-auto custom-scrollbar-gold pr-1.5 space-y-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 p-4 sm:p-5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]"
    >
      {/* Metadados: Categoria, Estado e Agência Oficial */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            id="badge-curiosidade-categoria"
            className={`badge-curiosidade-categoria px-3 py-1.5 rounded-xl border text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-xs ${currentMeta.badgeBg}`}
          >
            <CategoryIcon className="w-4 h-4" />
            {currentMeta.label}
          </span>

          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-[13px] font-bold text-slate-100 shadow-xs">
            {tip.stateName} ({tip.stateId})
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-xl border border-amber-500/30 shadow-xs">
            Fonte: {tip.sourceAgency}
          </span>
        </div>
      </div>

      {/* Título Principal */}
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-serif tracking-wide">{tip.title}</h3>
        <p className="text-sm sm:text-[15px] text-amber-300 font-medium leading-relaxed">
          {tip.fact}
        </p>
      </div>

      {/* Destaque "Você Sabia?" */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-100 text-sm sm:text-[15px] leading-relaxed flex gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="font-sans font-medium">{tip.didYouKnow}</div>
      </div>

      {/* Aprofundamento Científico / Histórico */}
      <div className="text-sm text-slate-200 leading-relaxed space-y-1.5 pt-1">
        <div className="text-xs font-bold text-amber-400/90 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Contexto Científico & Dados Oficiais</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-[15px] leading-relaxed">{tip.curiosityDepth}</p>
        <p className="text-xs font-mono text-slate-400 italic pt-1 border-t border-slate-800/80 mt-2">
          Registro Oficial: {tip.sourceDetail}
        </p>
      </div>
    </div>
  );
};
