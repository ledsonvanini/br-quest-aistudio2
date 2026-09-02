import React from 'react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { getGuardianSpeech } from '../../data/guardianPhrases';
import { Sparkles, Swords, ShieldCheck, Award } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

export interface IsolatedRightGuardianStandeeProps {
  activeStateId: string | null;
  completedStateIds: Set<string>;
  onSelectGuardian: (guardian: GuardianData) => void;
}

export const IsolatedRightGuardianStandee: React.FC<IsolatedRightGuardianStandeeProps> = ({
  activeStateId,
  completedStateIds,
  onSelectGuardian,
}) => {
  // Por padrão, utiliza o guardião de Brasília (DF) caso nenhum outro estado tenha sido selecionado ou pairado
  const guardian = React.useMemo(() => {
    const idToUse = activeStateId || 'DF';
    return (
      GUARDIANS_DATA.find((g) => g.id === idToUse) ||
      GUARDIANS_DATA.find((g) => g.id === 'DF') ||
      null
    );
  }, [activeStateId]);

  const speech = React.useMemo(() => {
    if (!guardian) return null;
    return getGuardianSpeech(guardian.id);
  }, [guardian]);

  const isCompleted = guardian ? completedStateIds.has(guardian.id) : false;
  const characterImgSrc = guardian?.id === 'RS' ? '/RS/itens/w-gaucho.png' : guardian?.avatarUrl;
  const coatUrl = guardian ? getCoatOfArmsUrl(guardian.id) : '';
  const flagUrl = guardian ? getStateFlagUrl(guardian.id) : '';

  const handleClick = () => {
    if (!guardian) return;
    audioEngine.playSfx('travel');
    onSelectGuardian(guardian);
  };

  return (
    <AnimatePresence>
      {guardian && speech && (
        <motion.div
          key={`standee-direita-${guardian.id}`}
          id="standee-guardiao-direita"
          initial={{ opacity: 0, x: 70, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="painel-guardiao-isolado-direita fixed right-3 sm:right-5 md:right-7 lg:right-9 top-14 sm:top-15 md:top-16 bottom-14 sm:bottom-16 w-[250px] sm:w-[290px] md:w-[320px] z-30 pointer-events-none flex flex-col justify-between items-center select-none"
        >
          {/* ========================================================================= */}
          {/* 1. BALÃO DE DIÁLOGO DO GUARDIÃO (TEXTO ÚNICO E PERSONALIZADO POR ESTADO) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.22 }}
            onClick={handleClick}
            className="balao-dialogo-guardiao-topo balao-dialogo-guardiao-direita relative w-full pointer-events-auto cursor-pointer group mb-1.5"
            title={`Clique para falar com ${guardian.guardianName} (${guardian.stateNamePt})`}
          >
            <div className="relative bg-[#020d24]/95 backdrop-blur-xl border-2 border-amber-400 rounded-2xl p-3 shadow-[0_12px_45px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.35)] text-slate-100 transition-all duration-200 group-hover:border-amber-300 group-hover:shadow-[0_12px_50px_rgba(0,0,0,0.98),0_0_32px_rgba(245,158,11,0.5)]">
              {/* Header do Balão: Bandeira + UF + Nome + XP */}
              <div className="flex items-center justify-between gap-1.5 border-b border-amber-500/30 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={guardian.stateNamePt}
                      className="w-5 h-3.5 object-cover rounded border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="font-mono font-black text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 shrink-0">
                    {guardian.id}
                  </span>
                  <span className="font-serif font-bold text-xs text-amber-200 truncate">
                    {guardian.guardianName}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold shrink-0">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>+100 XP</span>
                </div>
              </div>

              {/* Saudação Exclusiva e Riqueza Textual Autêntica de Cada Estado */}
              <div className="space-y-1.5 text-left">
                <p className="text-[12px] sm:text-[13px] text-amber-300 font-serif font-bold leading-tight">
                  {speech.greeting}
                </p>

                <p className="text-[11px] sm:text-xs text-slate-200 leading-snug font-serif">
                  {speech.loreSnippet}
                </p>

                <div className="text-[10px] sm:text-[11px] text-amber-200/90 font-serif italic flex items-center gap-1 pt-0.5 border-t border-slate-800">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{speech.challengeQuote}</span>
                </div>

                {/* Call To Action Destacado: Clique no mapa e me desafie! */}
                <div className="btn-desafio-balao-cta mt-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-slate-950 font-serif font-black text-[11px] shadow-md transition-all">
                  <Swords className="w-3.5 h-3.5 text-slate-950 shrink-0 animate-pulse" />
                  <span>Clique no mapa para viajar e me desafiar!</span>
                </div>
              </div>

              {/* Rabicho / Tail Triangular do Balão de Diálogo apontando para baixo */}
              <div
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-amber-400"
                style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.7))' }}
              />
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#020d24]"
              />
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. CORPO DO GUARDIÃO (STAND-EE COM ILUSTRAÇÃO E BANNER DE TÍTULO) */}
          {/* ========================================================================= */}
          <div className="standee-guardiao-corpo-inteiro relative flex-1 w-full flex flex-col justify-end items-center overflow-visible group">
            
            {/* Soft Ambient Mana Aura Glow behind Guardian */}
            <div className="absolute bottom-6 w-44 sm:w-52 h-44 sm:h-52 bg-amber-500/25 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse" />

            {/* Natural Floor Contact Shadow under feet */}
            <div className="absolute bottom-4 w-40 sm:w-48 h-4 bg-black/95 rounded-[100%] blur-md pointer-events-none -z-10" />

            {/* Full-Body Isolated Character Graphic Standee */}
            <div
              onClick={handleClick}
              className="relative flex-1 flex items-end justify-center pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 overflow-visible"
              title={`Clique para dialogar com ${guardian.guardianName} (${guardian.stateNamePt})`}
            >
              <img
                src={characterImgSrc}
                alt={guardian.guardianName}
                className="sprite-guardiao-isolado h-full max-h-[100%] w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[250px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />

              {/* Floating Official State Coat of Arms / Crest */}
              <div className="absolute top-2 left-1 w-9 h-9 rounded-2xl bg-slate-950/90 border-2 border-amber-400 flex items-center justify-center shadow-xl backdrop-blur-sm overflow-hidden p-1">
                <img
                  src={coatUrl || `https://flagcdn.com/w80/br-${guardian.id.toLowerCase()}.png`}
                  alt={guardian.stateNamePt}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Status Badge */}
              {isCompleted && (
                <div className="absolute top-2 right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300">
                  <ShieldCheck className="w-3 h-3" />
                  Conquistado
                </div>
              )}
            </div>

            {/* Character Title & Name Card Floating Banner */}
            <div
              onClick={handleClick}
              className="banner-nome-guardiao-direita pointer-events-auto cursor-pointer -mt-2 z-20 px-3 py-1 bg-slate-950/95 rounded-xl border border-amber-500/80 backdrop-blur-md text-center shadow-xl space-y-0.5 hover:border-amber-300 transition-all group/banner"
            >
              <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                {guardian.guardianTitlePt}
              </div>
              <h3 className="font-serif font-black text-xs text-white tracking-wide flex items-center justify-center gap-1.5">
                <span>{guardian.guardianName}</span>
                <span className="text-[10px] font-mono text-amber-300 px-1 py-0.2 bg-amber-500/20 rounded border border-amber-400/40">
                  {guardian.id}
                </span>
              </h3>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
