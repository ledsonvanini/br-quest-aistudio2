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
      ? 'top-full mt-3.5'
      : 'bottom-full mb-3.5';

  return (
    <div
      className={`balao-dialogo-informativo absolute ${alignClasses} ${positionClasses} z-[99999] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out w-80 sm:w-96 md:w-[420px] max-w-[92vw] whitespace-normal break-words ${className}`}
      style={{
        isolation: 'isolate',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'geometricPrecision',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Container do Balão (+50% tamanho, 100% Sólido e Borda Dourada Nítida de Alta Resolução) */}
      <div className="relative bg-slate-950 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_20px_rgba(245,158,11,0.35)] text-left select-none overflow-hidden">
        
        {/* Setinha Indicadora do Balão de Diálogo (Speech Bubble Arrow) 100% Sólida */}
        {side === 'bottom' ? (
          <div
            className={`absolute -top-2 ${
              align === 'left' ? 'left-5' : align === 'right' ? 'right-5' : 'left-1/2 -translate-x-1/2'
            } w-4 h-4 bg-slate-950 border-t-2 border-l-2 border-amber-400 rotate-45 z-20`}
          />
        ) : (
          <div
            className={`absolute -bottom-2 ${
              align === 'left' ? 'left-5' : align === 'right' ? 'right-5' : 'left-1/2 -translate-x-1/2'
            } w-4 h-4 bg-slate-950 border-b-2 border-r-2 border-amber-400 rotate-45 z-20`}
          />
        )}

        {/* Cabeçalho do Balão */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <h4 className="font-serif font-black text-sm sm:text-base text-amber-300 tracking-wide break-words drop-shadow">
            {title}
          </h4>
          {badge && (
            <span
              className={`text-[11px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 shadow-sm ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Texto Explicativo Didático com Tipografia Clara e Legível */}
        <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed break-words font-semibold">
          {description}
        </p>

        {/* Detalhe Extra Opcional */}
        {extraDetail && (
          <div className="mt-2.5 pt-2 border-t border-amber-500/30 text-[11px] sm:text-xs text-amber-200 font-serif italic break-words flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>{extraDetail}</span>
          </div>
        )}
      </div>
    </div>
  );
};
