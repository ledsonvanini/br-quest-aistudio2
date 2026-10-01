import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Award,
} from 'lucide-react';
import { useDailyTips } from '../../hooks/useDailyTips';
import { audioEngine } from '../../lib/audioSynth';
import { DailyTipCard, CATEGORY_META } from './DailyTipCard';

interface DailyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportToState: (stateId: string, suggestedMode: '2d' | 'globo3d') => void;
  onGainXp: (xp: number, label: string) => void;
  dailyTipsController?: ReturnType<typeof useDailyTips>;
}

export const DailyTipsModal: React.FC<DailyTipsModalProps> = ({
  isOpen,
  onClose,
  onTeleportToState,
  onGainXp,
  dailyTipsController,
}) => {
  const defaultTips = useDailyTips(dailyTipsController ? undefined : onGainXp);
  const {
    todayTips,
    activeTipIndex,
    setActiveTipIndex,
    currentTip,
    readTipIds,
    markTipAsRead,
    isTipRead,
    allTipsRead,
    claimedBonus,
    claimDailyBonus,
    nextTip,
    prevTip,
    bonusXpAmount,
  } = dailyTipsController || defaultTips;

  useEffect(() => {
    if (isOpen && currentTip) {
      markTipAsRead(currentTip.id);
    }
  }, [isOpen, currentTip, markTipAsRead]);

  if (!isOpen || !currentTip) return null;

  const handleTeleport = () => {
    audioEngine.playSfx('click');
    onClose();
    onTeleportToState(currentTip.stateId, currentTip.suggestedMode);
  };

  return (
    <div
      id="modal-dicas-do-dia-backdrop"
      className="modal-dicas-do-dia-backdrop fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-dicas-do-dia-container"
        className="modal-dicas-do-dia-container painel-dicas-unificado relative w-[96vw] max-w-4xl max-h-[88vh] bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 flex flex-col overflow-hidden my-auto"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="ornamento-canto-tr absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
        <div className="ornamento-canto-bl absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="ornamento-canto-br absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

        {/* Top Header */}
        <header className="cabecalho-dicas flex items-center justify-between pb-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-serif font-black tracking-wide text-slate-100 flex items-center gap-2">
                  5 Dicas do Dia • Você Sabia?
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {readTipIds.length} / {todayTips.length} Lidas
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-300 font-sans hidden sm:block">
                Pílulas diárias de inteligência geográfica oficial (IBGE • INMET • INPE • ICMBio)
              </p>
            </div>
          </div>

          <button
            id="btn-fechar-dicas"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-dicas text-slate-300 hover:text-slate-950 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500 border border-amber-500/40 transition-all cursor-pointer shadow-md"
            aria-label="Fechar Dicas do Dia"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 5 Tabs de Navegação Diária */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 my-3.5 shrink-0">
          {todayTips.map((tip, idx) => {
            const meta = CATEGORY_META[tip.category];
            const Icon = meta.icon;
            const isRead = isTipRead(tip.id);
            const isActive = idx === activeTipIndex;

            return (
              <button
                key={tip.id}
                onClick={() => {
                  audioEngine.playSfx('click');
                  setActiveTipIndex(idx);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition border text-xs relative cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md border-amber-400 ring-1 ring-amber-400/50 scale-[1.02]'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : meta.color}`} />
                  <span className="font-bold text-xs">{idx + 1}</span>
                </div>
                <span className="text-[11px] font-mono hidden sm:block truncate mt-0.5 max-w-[80px]">
                  {tip.stateId}
                </span>
                {isRead && (
                  <span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 font-bold" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Card Principal da Curiosidade */}
        <DailyTipCard tip={currentTip} />

        {/* Barra de Ação Inferior: Teletransporte & Bônus */}
        <footer className="pt-3.5 mt-2 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Navegação Entre Dicas */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              id="btn-dica-anterior"
              onClick={() => {
                audioEngine.playSfx('click');
                prevTip();
              }}
              className="btn-dica-anterior px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <span className="text-xs text-amber-300 px-3 font-mono font-bold">
              {activeTipIndex + 1} / {todayTips.length}
            </span>
            <button
              id="btn-dica-proxima"
              onClick={() => {
                audioEngine.playSfx('click');
                nextTip();
              }}
              className="btn-dica-proxima px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <span>Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Ações Especiais: Teletransporte ou Bônus Final */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {allTipsRead && !claimedBonus ? (
              <button
                id="btn-coletar-bonus-xp"
                onClick={claimDailyBonus}
                className="btn-coletar-bonus-xp w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer border border-yellow-200"
              >
                <Award className="w-4 h-4" />
                Coletar Bônus Diário (+{bonusXpAmount} XP)
              </button>
            ) : claimedBonus ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-2 rounded-xl flex items-center gap-1.5 font-mono shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Bônus de Hoje Coletado!
              </span>
            ) : null}

            <button
              id="btn-teletransporte-estado"
              onClick={handleTeleport}
              className="btn-teletransporte-estado w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              {currentTip.suggestedMode === 'globo3d' ? (
                <Globe className="w-4 h-4 text-amber-400" />
              ) : (
                <MapPin className="w-4 h-4 text-amber-400" />
              )}
              Explorar {currentTip.stateId} no Mapa
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default DailyTipsModal;
