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

  // Marca a dica atual como lida automaticamente ao visualizá-la
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
      className="modal-dicas-do-dia-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-dicas-do-dia-container"
        className="modal-dicas-do-dia-container relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-100 font-sans flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Botão Fechar */}
        <button
          id="btn-fechar-dicas"
          onClick={onClose}
          className="btn-fechar-dicas absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-xl hover:bg-stone-800 transition"
          aria-label="Fechar Dicas do Dia"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 pr-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-wide text-amber-300">
                  5 Dicas do Dia: Você Sabia?
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {readTipIds.length} / {todayTips.length} Lidas
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Pílulas diárias de inteligência geográfica oficial (IBGE • INPE • NASA • ICMBio)
              </p>
            </div>
          </div>
        </div>

        {/* 5 Tabs de Navegação Diária */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 my-4">
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
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition border text-xs relative ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg'
                    : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                  <span className="font-bold">{idx + 1}</span>
                </div>
                <span className="text-[10px] hidden sm:block truncate mt-0.5 max-w-[80px]">
                  {tip.stateId}
                </span>
                {isRead && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Card Principal da Curiosidade */}
        <DailyTipCard tip={currentTip} />

        {/* Barra de Ação Inferior: Teletransporte & Bônus */}
        <div className="pt-4 mt-2 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Navegação Entre Dicas */}
          <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
            <button
              id="btn-dica-anterior"
              onClick={prevTip}
              className="btn-dica-anterior px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <span className="text-xs text-stone-400 px-2 font-mono">
              {activeTipIndex + 1} / {todayTips.length}
            </span>
            <button
              id="btn-dica-proxima"
              onClick={nextTip}
              className="btn-dica-proxima px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Ações Especiais: Teletransporte ou Bônus Final */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {allTipsRead && !claimedBonus ? (
              <button
                id="btn-coletar-bonus-xp"
                onClick={claimDailyBonus}
                className="btn-coletar-bonus-xp w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:scale-105 active:scale-95"
              >
                <Award className="w-4 h-4" />
                Coletar Bônus Diário (+{bonusXpAmount} XP)
              </button>
            ) : claimedBonus ? (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bônus de Hoje Coletado!
              </span>
            ) : null}

            <button
              id="btn-teletransporte-estado"
              onClick={handleTeleport}
              className="btn-teletransporte-estado w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              {currentTip.suggestedMode === 'globo3d' ? (
                <Globe className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
              )}
              Explorar {currentTip.stateId} no Mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DailyTipsModal;
