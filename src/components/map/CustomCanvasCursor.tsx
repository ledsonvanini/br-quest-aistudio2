import React, { useEffect, useState, useRef } from 'react';
import { Hand, Grab } from 'lucide-react';

interface CustomCanvasCursorProps {
  isDragging: boolean;
  hoveredStateId: string | null;
  hoveredCountryId: string | null;
  isDwellZoomed?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const CustomCanvasCursor: React.FC<CustomCanvasCursorProps> = ({
  isDragging,
  hoveredStateId,
  hoveredCountryId,
  isDwellZoomed = false,
  containerRef,
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isOverRadio, setIsOverRadio] = useState<boolean>(false);
  const [isOverClickable, setIsOverClickable] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const targetPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const isDwellActiveRef = useRef<boolean>(false);
  isDwellActiveRef.current = isDwellZoomed;

  const isOverRadioRef = useRef<boolean>(false);
  const isOverClickableRef = useRef<boolean>(false);
  const lastHitTestTimeRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      // Check if mouse is over any modal, dialog, lateral panel, vintage radio, climate observatory, top menu, footer, scrollable window or scrollbar
      const isOverModalOrScrollable = Boolean(
        target?.closest?.(
          '.modal-dialog-climatologia-estado, #dialog-climatologia-estado, .painel-dialog-clima, ' +
          '.modal-dialog-biodiversidade-estado, #dialog-biodiversidade-estado, .painel-dialog-biodiversidade, ' +
          '.coluna-radio-vintage-independente, .painel-radio-vintage-player, .painel-app-radio-vintage, .painel-split-radio-esquerda, #painel-split-radio-esquerda, ' +
          '.painel-observatorio-clima, .painel-observatorio-ambiental, .painel-app-observatorio, #painel-controle-biodiversidade, ' +
          '.painel-card-telemetria-observatorio, .painel-card-musical-mapa, .painel-lateral-detalhes-estado, #sidebar-detalhes-estado, ' +
          '.menu-superior-status, #menu-global-topo-unificado, .rodape-aplicacao, #rodape-aplicacao-dinamico, .painel-toolbar-relevo, ' +
          '.modal-arvore-habilidades, .modal-quiz-guardiao, .modal-configuracoes, .modal-inventario-guardiao, .modal-filosofia-sobre, .modal-neighbor-country, ' +
          '.painel-hud-controles, .painel-controles-clima, .painel-controles-biodiversidade, .painel-card-detalhes-estado, .painel-split-view-app, ' +
          '[role="dialog"], .dialog-overlay, .modal-backdrop, .modal-conteudo, [data-scrollable], .overflow-y-auto, .overflow-x-auto, .scrollbar-thin'
        )
      );

      if (isOverModalOrScrollable) {
        if (cursorRef.current) cursorRef.current.style.display = 'none';
        setIsVisible(false);
        isOverClickableRef.current = false;
        setIsOverClickable(false);
        isOverRadioRef.current = false;
        setIsOverRadio(false);
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetPosRef.current = { x, y };

      if (!cursorRef.current?.style.display || cursorRef.current.style.display === 'none') {
        if (cursorRef.current) cursorRef.current.style.display = 'block';
        setIsVisible(true);
      }

      // Throttled hit test (max 10x/sec) to avoid layout thrashing while moving cursor
      const now = performance.now();
      if (now - lastHitTestTimeRef.current > 80) {
        lastHitTestTimeRef.current = now;
        const overRadio = Boolean(
          target?.closest?.(
            '.painel-radio-vintage-player, #painel-radio-vintage-player, [data-radio-interactive], .radio-device-cabinet'
          )
        );
        const overClickable = Boolean(
          target?.closest?.(
            'button, input, select, a, [role="button"], .cursor-pointer, input[type="range"], .interactive-pin'
          )
        );

        if (overRadio !== isOverRadioRef.current) {
          isOverRadioRef.current = overRadio;
          setIsOverRadio(overRadio);
        }
        if (overClickable !== isOverClickableRef.current) {
          isOverClickableRef.current = overClickable;
          setIsOverClickable(overClickable);
        }
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsMouseDown(false);
    };

    // Direct 60fps GPU transform update without triggering React render passes
    const animate = () => {
      const target = targetPosRef.current;
      const current = currentPosRef.current;

      if (isDwellActiveRef.current && container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const blendedTargetX = target.x * 0.82 + centerX * 0.18;
        const blendedTargetY = target.y * 0.82 + centerY * 0.18;

        current.x += (blendedTargetX - current.x) * 0.35;
        current.y += (blendedTargetY - current.y) * 0.35;
      } else {
        // High-precision immediate tracking
        current.x += (target.x - current.x) * 0.88;
        current.y += (target.y - current.y) * 0.88;
      }

      if (cursorRef.current && container) {
        const containerRect = container.getBoundingClientRect();
        const screenX = Math.round(containerRect.left + current.x);
        const screenY = Math.round(containerRect.top + current.y);
        const isOffsetFingertip = isOverRadioRef.current || isOverClickableRef.current;
        const offsetTransform = isOffsetFingertip ? 'translate(-4px, -2px)' : 'translate(-50%, -50%)';

        cursorRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0px) ${offsetTransform}`;
      }

      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  if (!isVisible) {
    return null;
  }

  const isOverLand = Boolean(hoveredStateId || hoveredCountryId);

  return (
    <div
      ref={cursorRef}
      id="cursor-virtual-personalizado"
      className="cursor-virtual-personalizado pointer-events-none fixed left-0 top-0 z-50 select-none will-change-transform"
      style={{
        transform: isOverRadio || isOverClickable ? 'translate(-4px, -2px)' : 'translate(-50%, -50%)',
      }}
    >
      {/* ========================================================================= */}
      {/* MODO A: SOBRE O RÁDIO VINTAGE OU CONTROLES INTERATIVOS (MÃOZINHA DE APONTAR)*/}
      {/* ========================================================================= */}
      {isOverRadio || (isOverClickable && !isDragging) ? (
        <div
          className={`relative flex items-center justify-center transition-transform duration-75 ${
            isMouseDown ? 'scale-90' : 'hover:scale-105'
          }`}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 4px rgba(251,191,36,0.6))',
          }}
        >
          {/* Vintage Brass Index Pointing Hand SVG */}
          <svg
            width="26"
            height="28"
            viewBox="0 0 26 28"
            fill="none"
            className="transform-gpu"
          >
            {/* Hand Contour / Shadow Outline */}
            <path
              d="M 5 2 C 3.5 2 3 3.5 3 5 L 3 13 C 3 14 2 15 1 16 C 0 17 0 19 1 20 L 3 24 C 4 26 6 27 8 27 L 16 27 C 19 27 21 25 22 22 L 23 16 C 23.5 13 22 11 19 11 L 18 11 L 18 8 C 18 6.5 16.5 6.5 15 8 L 15 11 L 14 11 L 14 6 C 14 4.5 12.5 4.5 11 6 L 11 11 L 10 11 L 10 3 C 10 1.5 8.5 1.5 7 3 L 7 11 L 6 11 L 6 3 C 6 2 5.5 2 5 2 Z"
              fill="#78350f"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Brass / Gold Body Shading */}
            <path
              d="M 5.5 3 C 4.5 3 4.5 4 4.5 5 L 4.5 13 L 2.5 16.5 L 4 23.5 C 5 25 6.5 25.5 8.5 25.5 L 15.5 25.5 C 17.5 25.5 19.5 24 20.5 21.5 L 21.5 16 C 21.5 13.5 20.5 12.5 18 12.5 L 16.5 12.5 L 16.5 8.5 C 16.5 7.5 15.5 7.5 14.5 8.5 L 14.5 12 L 12.5 12 L 12.5 6.5 C 12.5 5.5 11.5 5.5 10.5 6.5 L 10.5 12 L 8.5 12 L 8.5 3.5 C 8.5 2.5 7.5 2.5 6.5 3.5 L 6.5 12 L 5.5 12 Z"
              fill="url(#brassGoldGradient)"
            />
            {/* Luminous Index Fingertip Highlight */}
            <circle cx="5.5" cy="4" r="1.8" fill="#ffffff" opacity="0.95" />
            <circle cx="5.5" cy="4" r="3.2" fill="#fde047" opacity="0.4" />

            {/* Brass Metallic Gradients */}
            <defs>
              <linearGradient id="brassGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Precision Click Indicator Pip */}
          <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-amber-300 ring-1 ring-amber-500 animate-ping opacity-75" />
        </div>
      ) : isOverLand ? (
        /* ========================================================================= */
        /* MODO B: SOBRE O MAPA / ESTADO / PAÍS (MÃOZINHA DE LATÃO / OURO SEM FUNDO) */
        /* ========================================================================= */
        <div className="relative flex items-center justify-center">
          {!isDragging && (
            <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-[3px] pointer-events-none" />
          )}

          {isDragging ? (
            /* Clean Gold Grasping Hand */
            <div
              className="flex items-center justify-center scale-95 transition-transform"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 4px rgba(245,158,11,0.5))',
              }}
            >
              <Grab className="w-6 h-6 text-amber-300 fill-amber-400/50 stroke-[2]" />
            </div>
          ) : (
            /* Clean Gold Open Hand */
            <div
              className="flex items-center justify-center scale-105 transition-transform"
              style={{
                filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.85)) drop-shadow(0 0 5px rgba(253,224,71,0.6))',
              }}
            >
              <Hand className="w-6 h-6 text-yellow-300 fill-yellow-400/45 stroke-[2]" />
            </div>
          )}

          {/* Clean UF Badge indicator attached cleanly to cursor */}
          {hoveredStateId && !isDragging && (
            <div className="absolute left-7 whitespace-nowrap px-1.5 py-0.5 rounded-md bg-slate-950/90 border border-amber-400/80 text-amber-200 font-mono font-black text-[10px] shadow-lg shadow-black/80">
              {hoveredStateId}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODO C: SOBRE O OCEANO (BÚSSOLA NÁUTICA ELEGANTE SEM FUNDO ESCURO)        */
        /* ========================================================================= */
        <div
          className="relative w-9 h-9 flex items-center justify-center pointer-events-none"
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.85)) drop-shadow(0 0 4px rgba(245,158,11,0.4))',
          }}
        >
          {/* Nautical Compass Star SVG */}
          <svg
            className="w-9 h-9 animate-[spin_40s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            {/* Outer Graduation Ring */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="3 3" opacity="0.85" />
            <circle cx="50" cy="50" r="39" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />

            {/* Intercardinal Points (NW, NE, SW, SE) */}
            <polygon points="22,22 46,44 50,50" fill="#f59e0b" />
            <polygon points="22,22 44,46 50,50" fill="#78350f" />
            <polygon points="78,22 56,44 50,50" fill="#78350f" />
            <polygon points="78,22 54,46 50,50" fill="#f59e0b" />
            <polygon points="22,78 46,56 50,50" fill="#78350f" />
            <polygon points="22,78 44,54 50,50" fill="#f59e0b" />
            <polygon points="78,78 56,56 50,50" fill="#f59e0b" />
            <polygon points="78,78 54,54 50,50" fill="#78350f" />

            {/* Primary Cardinal Points: South, East, West */}
            <polygon points="50,94 56,58 50,50" fill="#78350f" />
            <polygon points="50,94 44,58 50,50" fill="#fbbf24" />
            <polygon points="6,50 42,56 50,50" fill="#fbbf24" />
            <polygon points="6,50 42,44 50,50" fill="#78350f" />
            <polygon points="94,50 58,56 50,50" fill="#78350f" />
            <polygon points="94,50 58,44 50,50" fill="#fbbf24" />

            {/* NORTH NEEDLE: High-contrast Crimson Red & Brilliant Gold */}
            <polygon points="50,6 57,42 50,50" fill="#ef4444" stroke="#dc2626" strokeWidth="0.5" />
            <polygon points="50,6 43,42 50,50" fill="#fde047" stroke="#eab308" strokeWidth="0.5" />

            {/* Central Brass Pivot Ring & Ruby Center */}
            <circle cx="50" cy="50" r="7" fill="#78350f" stroke="#fde047" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="3.5" fill="#ef4444" />
            <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
          </svg>
        </div>
      )}

      {/* Neighbor Countries Label */}
      {hoveredCountryId && !hoveredStateId && !isDragging && !isOverRadio && (
        <div className="absolute left-7 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border border-sky-400/80 text-sky-200 font-serif font-bold text-[11px] shadow-xl animate-in fade-in duration-100">
          {hoveredCountryId}
        </div>
      )}
    </div>
  );
};
