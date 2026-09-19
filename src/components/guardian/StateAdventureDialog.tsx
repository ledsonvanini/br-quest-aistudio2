import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  Swords,
  BookOpen,
  MapPin,
  Trees,
  Bird,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { BRAZIL_STATES_REGISTRY, getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';

interface StateAdventureDialogProps {
  stateId: string;
  isCompleted?: boolean;
  hasInsignia?: boolean;
  onClose: () => void;
  onEnterGuardianScene: (guardian: GuardianData) => void;
  onToggleExpand?: (expanded: boolean) => void;
}

export const StateAdventureDialog: React.FC<StateAdventureDialogProps> = ({
  stateId,
  isCompleted = false,
  hasInsignia = false,
  onClose,
  onEnterGuardianScene,
  onToggleExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'perfil' | 'historia' | 'desafios'>('perfil');

  const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
  const registry = BRAZIL_STATES_REGISTRY[stateId];

  if (!guardian) return null;

  const flagUrl = getStateFlagUrl(stateId);

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    const next = !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  const handleStartChallenge = () => {
    audioEngine.playSfx('travel');
    onEnterGuardianScene(guardian);
  };

  return (
    <aside
      id={`dialog-applateral-aventura-${stateId.toLowerCase()}`}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={`painel-applateral-aventura painel-guardiao-detalhes fixed top-16 sm:top-20 right-2 sm:right-4 z-40 flex flex-col bg-[#050f24]/95 backdrop-blur-2xl border-2 border-teal-500/50 rounded-2xl shadow-2xl shadow-black/90 text-white transition-all duration-300 pointer-events-auto select-none overflow-hidden ${
        isExpanded ? 'w-[340px] sm:w-[420px] md:w-[480px] max-h-[85vh]' : 'w-[300px] sm:w-[340px] max-h-[70vh]'
      }`}
      aria-label={`Guardião de ${guardian.stateNamePt}`}
    >
      {/* Header com Avatar, Bandeira e Ações */}
      <div className="relative p-3 sm:p-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-amber-950/60 border-b border-teal-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={guardian.avatarUrl}
              alt={guardian.guardianName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-teal-400 shadow-md shadow-teal-950"
            />
            {flagUrl && (
              <img
                src={flagUrl}
                alt={guardian.stateNamePt}
                referrerPolicy="no-referrer"
                className="absolute -bottom-1 -right-1 w-5 h-3.5 object-cover rounded shadow border border-slate-950"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-teal-300 tracking-wider">
                {guardian.id} • {guardian.stateNamePt}
              </span>
              {hasInsignia && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400/40 text-[9px] font-bold text-amber-300">
                  INSÍGNIA CONQUISTADA
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-serif font-black text-amber-200 leading-tight">
              {guardian.guardianName}
            </h2>
            <p className="text-[11px] text-teal-200/80 italic font-serif line-clamp-1">
              {guardian.guardianTitlePt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleExpand}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isExpanded ? 'Recolher Painel' : 'Expandir Painel'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-painel p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Fechar Detalhes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navegação Interna por Abas */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-3 pt-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('perfil')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            activeTab === 'perfil'
              ? 'text-teal-300 border-teal-400 font-bold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Perfil do Guardião
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('historia')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            activeTab === 'historia'
              ? 'text-teal-300 border-teal-400 font-bold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Tradição & Lore
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('desafios')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            activeTab === 'desafios'
              ? 'text-teal-300 border-teal-400 font-bold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Provas & Relíquias
        </button>
      </div>

      {/* Conteúdo com Rolagem */}
      <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1 text-xs text-slate-300">
        {activeTab === 'perfil' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-teal-300 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Capital: {guardian.capitalPt}
                </span>
                <span className="capitalize">{guardian.regionId.replace('_', '-')}</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {guardian.garbDescriptionPt}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <Bird className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Fauna Emblemática</div>
                  <div className="text-xs font-semibold text-slate-200">{guardian.faunaPt}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                <Trees className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Flora Simbólica</div>
                  <div className="text-xs font-semibold text-slate-200">{guardian.floraPt}</div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5" />
                Hino do Estado: {guardian.anthemTitle}
              </span>
              <p className="italic text-[11px] text-amber-100/70 line-clamp-2">
                &ldquo;{guardian.anthemLyricsPt.slice(0, 140)}...&rdquo;
              </p>
            </div>
          </div>
        )}

        {activeTab === 'historia' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/25 space-y-2">
              <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-400" />
                A Saga de {guardian.guardianName}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {guardian.loreStoryPt}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'desafios' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300">Desafio do Guardião</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                  +150 XP
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Responda às questões sobre história, geografia, cultura e biomas de {guardian.stateNamePt} para conquistar a Insígnia Sagrada deste território.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Fixo: Ação de Viagem / Desafio RPG */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleStartChallenge}
          className="btn-acao-viajar-estado w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 hover:from-teal-400 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Swords className="w-4 h-4" />
          <span>Desafiar Guardião no RPG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
