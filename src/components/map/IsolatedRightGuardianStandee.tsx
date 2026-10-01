import React from 'react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { getGuardianSpeech } from '../../data/guardianPhrases';
import { Sparkles, Swords, ShieldCheck, Award, X } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

export interface IsolatedRightGuardianStandeeProps {
  activeStateId: string | null;
  completedStateIds: Set<string>;
  onSelectGuardian: (guardian: GuardianData) => void;
  onClose?: () => void;
}

/**
 * IsolatedRightGuardianStandee
 * Exibição heróica e imponente do Guardião no modo BrQuest - Aventura.
 * Posicionado com autoridade à direita da tela, com diálogo límpido e sem excessos.
 */
export const IsolatedRightGuardianStandee: React.FC<IsolatedRightGuardianStandeeProps> = ({
  activeStateId,
  completedStateIds,
  onSelectGuardian,
  onClose,
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
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="painel-guardiao-isolado-direita fixed right-3 sm:right-6 md:right-8 top-14 sm:top-18 bottom-12 w-[300px] sm:w-[350px] md:w-[390px] z-30 pointer-events-none flex flex-col justify-end items-center select-none"
        >
          {/* ========================================================================= */}
          {/* 1. BALÃO DE DIÁLOGO DO GUARDIÃO (COMPACTO, LÍMPIDO E DIRETO)              */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.04, duration: 0.18 }}
            className="balao-dialogo-guardiao-topo balao-dialogo-guardiao-direita relative w-full pointer-events-auto mb-2"
          >
            <div className="card-balao-dialogo-conteudo relative bg-[#020d24]/95 backdrop-blur-xl border-2 border-amber-400/90 rounded-2xl p-3 shadow-[0_16px_45px_rgba(0,0,0,0.95),0_0_20px_rgba(245,158,11,0.25)] text-slate-100">
              {/* Header do Balão: Bandeira + UF + Nome + XP + Botão Fechar Opcional */}
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

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>+100 XP</span>
                  </div>
                  {onClose && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playSfx('click');
                        onClose();
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
                      title="Fechar Detalhes"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Saudação Direta e Marcante */}
              <p className="text-[13.5px] text-amber-200 font-serif font-bold leading-snug mb-2.5">
                &ldquo;{speech.greeting}&rdquo;
              </p>

              {/* Botão de Ação Imediata: Desafio do Guardião */}
              <button
                type="button"
                onClick={handleClick}
                className="btn-desafio-guardiao-acao w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-950/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
                title={`Iniciar desafio com ${guardian.guardianName}`}
              >
                <Swords className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>Desafiar Guardião ({guardian.stateNamePt})</span>
              </button>

              {/* Rabicho Triangular do Balão */}
              <div
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-amber-400"
                style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.7))' }}
              />
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#020d24]"
              />
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. CORPO DO GUARDIÃO (STAND-EE HERÓICO, IMPOENTE E SEM TEXTO EMBAIXO)     */}
          {/* ========================================================================= */}
          <div className="standee-guardiao-corpo-inteiro relative w-full flex flex-col justify-end items-center overflow-visible">
            {/* Mana Aura Glow */}
            <div className="absolute bottom-6 w-48 sm:w-56 h-48 sm:h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse" />

            {/* Sombra de Contato com o Chão */}
            <div className="absolute bottom-2 w-44 sm:w-52 h-4 bg-black/95 rounded-[100%] blur-md pointer-events-none -z-10" />

            {/* Ilustração do Personagem Ampliada com Presença Heroica */}
            <div
              onClick={handleClick}
              className="relative flex items-end justify-center pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 overflow-visible"
              title={`Clique para dialogar com ${guardian.guardianName} (${guardian.stateNamePt})`}
            >
              <img
                src={characterImgSrc}
                alt={guardian.guardianName}
                className="sprite-guardiao-isolado h-[270px] sm:h-[340px] md:h-[400px] lg:h-[440px] w-auto max-w-[270px] sm:max-w-[340px] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
