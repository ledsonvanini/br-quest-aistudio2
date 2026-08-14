import React from 'react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

interface IsolatedLeftGuardianStandeeProps {
  activeStateId: string | null;
  completedStateIds: Set<string>;
  onSelectGuardian: (guardian: GuardianData) => void;
}

export const IsolatedLeftGuardianStandee: React.FC<IsolatedLeftGuardianStandeeProps> = ({
  activeStateId,
  completedStateIds,
  onSelectGuardian,
}) => {
  const guardian = React.useMemo(() => {
    if (!activeStateId) return null;
    return GUARDIANS_DATA.find((g) => g.id === activeStateId) || null;
  }, [activeStateId]);

  const isCompleted = guardian ? completedStateIds.has(guardian.id) : false;
  const characterImgSrc = guardian?.id === 'RS' ? '/RS/w-gaucho.png' : guardian?.avatarUrl;
  const coatUrl = guardian ? getCoatOfArmsUrl(guardian.id) : '';

  const handleClick = () => {
    if (!guardian) return;
    audioEngine.playSfx('click');
    onSelectGuardian(guardian);
  };

  return (
    <AnimatePresence>
      {guardian && (
        <motion.div
          key={`standee-${guardian.id}`}
          id="standee-guardiao-esquerda"
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="painel-guardiao-isolado-esquerda absolute left-3 sm:left-6 top-14 bottom-24 z-20 pointer-events-none flex flex-col justify-end items-center select-none"
        >
          {/* --- UNBOXED GUARDIAN NPC STANDEE (80% OF AVAILABLE CANVA SPACE / TRANSPARENT BACKGROUND) --- */}
          <div className="standee-guardiao-corpo-inteiro relative h-[80%] max-h-[80%] flex flex-col justify-end items-center overflow-visible group">
            
            {/* Soft Ambient Mana Aura Glow behind Guardian */}
            <div className="absolute bottom-10 w-48 sm:w-56 h-48 sm:h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse" />

            {/* Natural Floor Contact Shadow under feet */}
            <div className="absolute bottom-6 w-44 sm:w-56 h-5 bg-black/90 rounded-[100%] blur-md pointer-events-none -z-10" />

            {/* Full-Body Isolated Character Graphic Standee */}
            <div
              onClick={handleClick}
              className="relative flex-1 flex items-end justify-center pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 overflow-visible"
              title={`Clique para dialogar com ${guardian.guardianName} (${guardian.stateNamePt})`}
            >
              <img
                src={characterImgSrc}
                alt={guardian.guardianName}
                className="sprite-guardiao-isolado h-full max-h-[100%] w-auto max-w-[220px] sm:max-w-[280px] lg:max-w-[320px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />

              {/* Floating Official State Flag / Coat of Arms */}
              <div className="absolute top-2 left-2 w-9 h-9 rounded-2xl bg-slate-950/90 border-2 border-amber-400 flex items-center justify-center shadow-xl backdrop-blur-sm overflow-hidden p-1">
                <span className="text-xs">{guardian.flagSymbol}</span>
                <img
                  src={coatUrl || `https://flagcdn.com/w80/br-${guardian.id.toLowerCase()}.png`}
                  alt={guardian.stateNamePt}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Status Badge */}
              {isCompleted && (
                <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300">
                  <ShieldCheck className="w-3 h-3" />
                  Conquistado
                </div>
              )}
            </div>

            {/* Character Title & Name Card Floating Banner */}
            <div
              onClick={handleClick}
              className="banner-nome-guardiao-esquerda pointer-events-auto cursor-pointer -mt-3 z-20 px-3 py-1.5 bg-slate-950/95 rounded-2xl border-2 border-amber-500/80 backdrop-blur-md text-center shadow-2xl space-y-0.5 hover:border-amber-300 transition-all group/banner"
            >
              <div className="text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                {guardian.guardianTitlePt}
              </div>
              <h3 className="font-serif font-black text-xs sm:text-sm text-white tracking-wide flex items-center justify-center gap-1.5">
                <span>{guardian.guardianName}</span>
                <span className="text-[10px] font-mono text-amber-300 px-1 py-0.2 bg-amber-500/20 rounded border border-amber-400/40">
                  {guardian.id}
                </span>
              </h3>

              <div className="btn-acao-conversar-guardiao pt-0.5 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-amber-300/90 font-medium group-hover/banner:text-yellow-200">
                <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                <span>Clique para Diálogo ▶</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
