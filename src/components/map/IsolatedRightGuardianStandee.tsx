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

/**
 * IsolatedRightGuardianStandee
 * Exibição elegante do Guardião no modo BrQuest - Aventura.
 * Centralizado verticalmente à direita da tela, integrando o balão de fala mítico
 * com a ilustração do personagem e brasão estadual, eliminando balões soltos no cursor.
 */
export const IsolatedRightGuardianStandee: React.FC<IsolatedRightGuardianStandeeProps> = ({
  activeStateId,
  completedStateIds,
  onSelectGuardian,
}) => {
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
    <AnimatePresence mode="wait">
      {guardian && speech && (
        <motion.div
          key={`standee-direita-${guardian.id}`}
          id="standee-guardiao-direita"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="painel-guardiao-isolado-direita fixed right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] md:w-[350px] z-30 pointer-events-none flex flex-col items-center select-none"
        >
          {/* ========================================================================= */}
          {/* 1. BALÃO DE DIÁLOGO DO GUARDIÃO (PROPORÇÃO 4x2 / 4x3 COM ALTO CONTRASTE) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            onClick={handleClick}
            className="balao-dialogo-guardiao-topo balao-dialogo-guardiao-direita relative w-full pointer-events-auto cursor-pointer group mb-2"
            title={`Clique para iniciar jornada com ${guardian.guardianName} (${guardian.stateNamePt})`}
          >
            <div className="card-balao-dialogo-conteudo relative bg-[#020d24]/95 backdrop-blur-xl border-2 border-amber-400/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_25px_rgba(245,158,11,0.3)] text-slate-100 transition-all duration-200 group-hover:border-amber-300 group-hover:shadow-[0_20px_55px_rgba(0,0,0,0.98),0_0_32px_rgba(245,158,11,0.5)]">
              {/* Header do Balão: Bandeira + UF + Nome + Recompensa */}
              <div className="flex items-center justify-between gap-1.5 border-b border-amber-500/30 pb-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={guardian.stateNamePt}
                      className="w-5 h-3.5 object-cover rounded border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 shrink-0">
                    {guardian.id}
                  </span>
                  <span className="font-serif font-black text-sm text-amber-200 truncate">
                    {guardian.guardianName}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10.5px] font-mono font-bold shrink-0">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>+100 XP</span>
                </div>
              </div>

              {/* Texto de Saudação e Lore com Tipografia Legível (>=13px) */}
              <div className="space-y-2 text-left">
                <p className="text-[13px] sm:text-[14px] text-amber-300 font-serif font-bold leading-snug">
                  {speech.greeting}
                </p>

                <p className="text-[12.5px] sm:text-[13px] text-slate-200 leading-relaxed font-sans line-clamp-3">
                  {speech.loreSnippet}
                </p>

                <div className="text-[11.5px] text-amber-200/90 font-serif italic flex items-center gap-1.5 pt-1.5 border-t border-slate-800/80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{speech.challengeQuote}</span>
                </div>

                {/* Call To Action Destacado */}
                <div className="btn-desafio-balao-cta mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 group-hover:from-amber-400 group-hover:to-yellow-400 text-slate-950 font-serif font-black text-xs shadow-md transition-all">
                  <Swords className="w-4 h-4 text-slate-950 shrink-0 animate-pulse" />
                  <span>Desafiar Guardião em {guardian.stateNamePt}</span>
                </div>
              </div>

              {/* Rabicho Triangular do Balão */}
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
          <div className="standee-guardiao-corpo-inteiro relative w-full flex flex-col justify-end items-center overflow-visible group">
            {/* Mana Aura Glow suave atrás do Guardião */}
            <div className="absolute bottom-4 w-48 sm:w-56 h-48 sm:h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse" />

            {/* Sombra de Contato com o Chão */}
            <div className="absolute bottom-2 w-44 sm:w-52 h-4 bg-black/95 rounded-[100%] blur-md pointer-events-none -z-10" />

            {/* Ilustração do Personagem */}
            <div
              onClick={handleClick}
              className="relative flex items-end justify-center pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 overflow-visible"
              title={`Clique para dialogar com ${guardian.guardianName} (${guardian.stateNamePt})`}
            >
              <img
                src={characterImgSrc}
                alt={guardian.guardianName}
                className="sprite-guardiao-isolado h-[220px] sm:h-[260px] md:h-[290px] w-auto max-w-[220px] sm:max-w-[250px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />

              {/* Brasão Oficial do Estado Flutuante */}
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

              {/* Selo de Conquista */}
              {isCompleted && (
                <div className="absolute top-2 right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Conquistado
                </div>
              )}
            </div>

            {/* Banner de Nome e Título do Guardião */}
            <div
              onClick={handleClick}
              className="banner-nome-guardiao-direita pointer-events-auto cursor-pointer -mt-2 z-20 px-3.5 py-1 bg-slate-950/95 rounded-xl border border-amber-500/80 backdrop-blur-md text-center shadow-xl space-y-0.5 hover:border-amber-300 transition-all group/banner"
            >
              <div className="text-[9.5px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                {guardian.guardianTitlePt}
              </div>
              <h3 className="font-serif font-black text-xs sm:text-sm text-white tracking-wide flex items-center justify-center gap-1.5">
                <span>{guardian.guardianName}</span>
                <span className="text-[10px] font-mono text-amber-300 px-1.5 py-0.2 bg-amber-500/20 rounded border border-amber-400/40">
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
