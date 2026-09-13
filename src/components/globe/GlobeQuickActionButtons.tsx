/**
 * GlobeQuickActionButtons - Botões de Ação Rápida no HUD para Acionamento de Grandes Painéis
 * (Simulador Solar & Translação, Astrometria & Telemetria)
 */
import React from 'react';
import { Sun, Activity } from 'lucide-react';

interface GlobeQuickActionButtonsProps {
  isSolarSimulatorOpen?: boolean;
  onToggleSolarSimulator?: () => void;
  isTelemetryOpen?: boolean;
  onToggleTelemetry?: () => void;
  onActionClick: (toggleFn?: () => void) => void;
}

export const GlobeQuickActionButtons: React.FC<GlobeQuickActionButtonsProps> = ({
  isSolarSimulatorOpen,
  onToggleSolarSimulator,
  isTelemetryOpen,
  onToggleTelemetry,
  onActionClick,
}) => {
  return (
    <>
      {/* Botão Destaque: Painel Completo do Simulador Solar & Translação */}
      {onToggleSolarSimulator && (
        <button
          type="button"
          id="btn-painel-simulador-solar"
          onClick={() => onActionClick(onToggleSolarSimulator)}
          className={`btn-painel-simulador-solar w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer text-xs shrink-0 shadow-sm ${
            isSolarSimulatorOpen
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-amber-500/30 ring-1 ring-amber-400/50'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/50 hover:border-amber-400'
          }`}
          title="Simulador Solar & Translação Completa (1 Ano)"
          aria-label="Simulador Solar"
        >
          <Sun className="w-4 h-4 shrink-0" />
        </button>
      )}

      {/* Botão Destaque: Telemetria Astrométrica & Rotas Geodésicas */}
      {onToggleTelemetry && (
        <button
          type="button"
          id="btn-painel-telemetria"
          onClick={() => onActionClick(onToggleTelemetry)}
          className={`btn-painel-telemetria w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer text-xs shrink-0 shadow-sm ${
            isTelemetryOpen
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-cyan-500/30 ring-1 ring-cyan-400/50'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border-cyan-500/40 hover:border-cyan-300'
          }`}
          title="Telemetria Astrométrica & Rotas Geodésicas"
          aria-label="Astrometria e Telemetria"
        >
          <Activity className="w-4 h-4 shrink-0" />
        </button>
      )}
    </>
  );
};
