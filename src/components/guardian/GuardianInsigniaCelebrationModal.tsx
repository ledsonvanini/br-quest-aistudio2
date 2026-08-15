import React, { useEffect } from 'react';
import { triggerConfetti } from '../../lib/storage';
import { audioEngine } from '../../lib/audioSynth';
import {
  Trophy,
  Award,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle,
  Crown,
  Star,
} from 'lucide-react';

interface Props {
  titleText: string;
  subtitleText?: string;
  insigniaName?: string;
  insigniaIcon?: string;
  xpGained?: number;
  levelReached?: number;
  onClose: () => void;
  onNavigateToSanctuary?: () => void;
}

export const GuardianInsigniaCelebrationModal: React.FC<Props> = ({
  titleText,
  subtitleText,
  insigniaName,
  insigniaIcon = '🛡️',
  xpGained = 300,
  levelReached,
  onClose,
  onNavigateToSanctuary,
}) => {
  useEffect(() => {
    // Trigger multi-stage confetti celebration
    triggerConfetti();
    audioEngine.playSfx('fanfare');

    const timer = setTimeout(() => {
      triggerConfetti();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="modal-celebracao-titulo"
      className="modal-celebracao-titulo fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in zoom-in-95 duration-300 select-none pointer-events-auto"
    >
      {/* Dynamic Celebration Sunburst Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-600/20 blur-3xl animate-pulse" />
      </div>

      <div
        id="painel-conquista-insignia"
        className="painel-conquista-insignia relative w-full max-w-lg bg-slate-950/98 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.5)] text-slate-100 flex flex-col items-center text-center space-y-5"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />

        {/* Floating Crown & Star Banner */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-1.5 rounded-full font-serif font-black text-xs uppercase tracking-wider shadow-lg border border-yellow-100 animate-bounce">
          <Crown className="w-4 h-4 text-slate-950" />
          <span>Glória e Honra Patriótica</span>
          <Star className="w-4 h-4 text-slate-950 fill-slate-950" />
        </div>

        {/* Insignia / Trophy Central Emblem with Golden Aura */}
        <div className="relative my-2">
          <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-xl animate-ping" />
          <div className="emblema-titulo-celebracao relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 p-1 shadow-[0_10px_30px_rgba(245,158,11,0.7)] flex items-center justify-center transform hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-xl bg-slate-950 flex flex-col items-center justify-center text-4xl sm:text-5xl border border-amber-300">
              {insigniaIcon ? (
                <span>{insigniaIcon}</span>
              ) : (
                <Trophy className="w-12 h-12 text-amber-400" />
              )}
            </div>
          </div>
        </div>

        {/* Title Announcement */}
        <div className="space-y-2">
          <div className="text-xs font-serif uppercase tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>Novo Título Conquistado!</span>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          </div>

          <h2 className="titulo-conquista-destaque font-serif font-black text-2xl sm:text-3xl text-amber-200 leading-tight">
            {titleText}
          </h2>

          {subtitleText && (
            <p className="text-xs sm:text-sm text-slate-300 font-serif max-w-sm mx-auto leading-relaxed">
              {subtitleText}
            </p>
          )}

          {insigniaName && (
            <div className="card-insignia-anuncio inline-flex items-center gap-2 bg-slate-900 border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-xs font-serif text-amber-300 shadow">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Insígnia Sagrada: <strong>{insigniaName}</strong></span>
            </div>
          )}
        </div>

        {/* Reward Badges Row */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-1">
          <div className="bg-slate-900 border border-amber-500/30 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-serif">XP Recebido</div>
            <div className="text-sm font-mono font-bold text-amber-300">+{xpGained} XP</div>
          </div>
          <div className="bg-slate-900 border border-amber-500/30 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-serif">Status do Códice</div>
            <div className="text-sm font-serif font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Registrado</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onNavigateToSanctuary && (
            <button
              onClick={() => {
                onClose();
                onNavigateToSanctuary();
              }}
              className="btn-visitar-santuario w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/60 font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ver no Santuário</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-continuar-jornada w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-serif font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-xl border border-yellow-200"
          >
            <span>Continuar Exploração</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
