import React from 'react';

interface SpeechBubbleTooltipProps {
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  extraDetail?: string;
  side?: 'bottom' | 'top';
  align?: 'center' | 'left' | 'right';
  className?: string;
}

export const SpeechBubbleTooltip: React.FC<SpeechBubbleTooltipProps> = ({
  title,
  badge,
  badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  description,
  extraDetail,
  side = 'bottom',
  align = 'center',
  className = '',
}) => {
  const alignClasses =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  const positionClasses =
    side === 'bottom'
      ? 'top-full mt-2.5'
      : 'bottom-full mb-2.5';

  return (
    <div
      className={`balao-dialogo-informativo absolute ${alignClasses} ${positionClasses} z-[350] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out w-64 sm:w-72 max-w-[85vw] whitespace-normal break-words ${className}`}
    >
      {/* Container do Balão com Fundo 100% Sólido e Borda Dourada Elegante */}
      <div className="relative bg-slate-950 border-2 border-amber-400/90 rounded-xl p-3 shadow-[0_16px_36px_rgba(0,0,0,0.95),0_0_12px_rgba(245,158,11,0.25)] text-left select-none overflow-hidden">
        
        {/* Setinha Indicadora do Balão de Diálogo (Speech Bubble Arrow) 100% Sólida */}
        {side === 'bottom' ? (
          <div
            className={`absolute -top-1.5 ${
              align === 'left' ? 'left-4' : align === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'
            } w-3 h-3 bg-slate-950 border-t-2 border-l-2 border-amber-400/90 rotate-45 z-20`}
          />
        ) : (
          <div
            className={`absolute -bottom-1.5 ${
              align === 'left' ? 'left-4' : align === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'
            } w-3 h-3 bg-slate-950 border-b-2 border-r-2 border-amber-400/90 rotate-45 z-20`}
          />
        )}

        {/* Cabeçalho do Balão */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
          <h4 className="font-serif font-bold text-xs text-amber-300 tracking-wide break-words">
            {title}
          </h4>
          {badge && (
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Texto Explicativo Didático */}
        <p className="text-[11px] text-slate-100 font-sans leading-relaxed break-words font-medium">
          {description}
        </p>

        {/* Detalhe Extra Opcional */}
        {extraDetail && (
          <div className="mt-1.5 pt-1.5 border-t border-amber-500/20 text-[10px] text-amber-200/90 font-serif italic break-words">
            {extraDetail}
          </div>
        )}
      </div>
    </div>
  );
};
