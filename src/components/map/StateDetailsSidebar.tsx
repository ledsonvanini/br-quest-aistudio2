import React from 'react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import {
  getStateRegistryById,
  getStateCoatOfArmsUrl,
} from '../../data/brazilStatesRegistry';
import {
  Compass,
  MapPin,
  Shield,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Landmark,
  TreePine,
  CheckCircle2,
} from 'lucide-react';

interface StateDetailsSidebarProps {
  activeStateId: string | null;
  completedStateIds: Set<string>;
  onSelectGuardian: (guardian: GuardianData) => void;
  onClearSelection?: () => void;
}

export const StateDetailsSidebar: React.FC<StateDetailsSidebarProps> = ({
  activeStateId,
  completedStateIds,
  onSelectGuardian,
}) => {
  // STRICT RULE: Only display information when mouse is over a state of Brazil
  if (!activeStateId) return null;

  const currentGuardian = GUARDIANS_DATA.find((g) => g.id === activeStateId);
  const stateRegistry = getStateRegistryById(activeStateId);
  const geoInfo = BRAZIL_STATES_GEO[activeStateId];

  if (!currentGuardian) return null;

  const isCompleted = completedStateIds.has(activeStateId);
  const coatUrl = getStateCoatOfArmsUrl(activeStateId) || stateRegistry?.coatOfArmsUrl || '';

  return (
    <aside
      id="sidebar-detalhes-estado"
      className="painel-lateral-detalhes-estado sidebar-detalhes-estado absolute right-3 sm:right-6 top-14 bottom-24 w-60 sm:w-68 z-20 flex flex-col pointer-events-auto select-none animate-fadeIn"
    >
      <div className="card-detalhes-conteudo relative flex-1 flex flex-col bg-slate-950/92 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300">
        {/* Glow ambient background aura */}
        <div
          className={`aura-fundo-sidebar absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isCompleted ? 'bg-amber-500/25' : 'bg-yellow-500/20'
          }`}
        />

        {/* Active State / Hovered State View */}
        <div className="secao-estado-ativo flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1">
          {/* Header with State Crest & Titles */}
          <div>
            <div className="flex items-start gap-3 mb-2.5">
              {/* State Coat of Arms with Gold Embellished Shield */}
              <div
                className={`moldura-brasao-sidebar relative w-14 h-18 rounded-b-xl rounded-t-sm flex items-center justify-center p-1 shadow-xl transition-transform duration-300 hover:scale-105 shrink-0 ${
                  isCompleted
                    ? 'bg-gradient-to-b from-amber-600 via-amber-800 to-amber-950 border-2 border-amber-300 shadow-amber-500/40'
                    : 'bg-gradient-to-b from-amber-800 via-amber-950 to-slate-950 border-2 border-yellow-400/80 shadow-yellow-500/30'
                }`}
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
                }}
              >
                {coatUrl ? (
                  <img
                    src={coatUrl}
                    alt={`Brasão de ${currentGuardian.stateNamePt}`}
                    className="w-full h-full object-contain drop-shadow-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Shield className="w-7 h-7 text-amber-400" />
                )}

                {/* Corner Star Accent */}
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="pill-sigla-uf px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50">
                    {currentGuardian.id}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    {stateRegistry?.region || geoInfo?.region || 'Brasil'}
                  </span>
                </div>

                <h3 className="titulo-estado text-base font-bold text-white tracking-wide truncate">
                  {currentGuardian.stateNamePt}
                </h3>

                <p className="subtitulo-guardiao text-[11px] text-amber-400/90 font-medium truncate flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  {currentGuardian.guardianTitlePt}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`tag-status-conquista mb-2.5 px-2.5 py-1 rounded-xl flex items-center justify-between text-[11px] font-semibold border ${
                isCompleted
                  ? 'bg-amber-500/15 border-amber-400/60 text-amber-300'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1">
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Reino Desbravado
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '10s' }} />
                    Pronto para Desafio
                  </>
                )}
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">+100 XP</span>
            </div>

            {/* Geographical & Cultural Details Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
              <div className="card-info-item bg-slate-900/70 border border-slate-800 rounded-lg p-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                  <Landmark className="w-2.5 h-2.5 text-amber-400" />
                  Capital
                </div>
                <div className="text-[11px] font-semibold text-slate-200 truncate">
                  {stateRegistry?.capital || geoInfo?.capital || '—'}
                </div>
              </div>

              <div className="card-info-item bg-slate-900/70 border border-slate-800 rounded-lg p-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                  <TreePine className="w-2.5 h-2.5 text-emerald-400" />
                  Bioma
                </div>
                <div className="text-[11px] font-semibold text-slate-200 truncate">
                  {geoInfo?.biome || 'Mata Atlântica'}
                </div>
              </div>
            </div>

            {/* Lore / Historical Summary */}
            <div className="caixa-lore-estado bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/20 rounded-xl p-2.5 mb-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mb-1">
                <BookOpen className="w-3 h-3 text-amber-400" />
                Tradições & Trilha do Guardião
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                {currentGuardian.loreStoryPt || currentGuardian.garbDescriptionPt}
              </p>
            </div>

            {/* Guardian Mini Preview */}
            {currentGuardian.avatarUrl && (
              <div className="preview-guardiao-mini flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1.5 mb-2">
                <img
                  src={currentGuardian.id === 'RS' ? '/RS/w-gaucho.png' : currentGuardian.avatarUrl}
                  alt={currentGuardian.guardianName}
                  className="w-8 h-8 rounded-lg object-cover border border-amber-500/50 bg-slate-950"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {currentGuardian.guardianName}
                  </div>
                  <div className="text-[10px] text-amber-400/80 truncate">
                    {currentGuardian.guardianTitlePt}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Travel / Challenge Action Button */}
          <button
            id="btn-sidebar-viajar-estado"
            onClick={() => onSelectGuardian(currentGuardian)}
            className="btn-acao-viajar-estado w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer mt-1"
          >
            <span>{isCompleted ? 'Revisitar Guardião' : 'Viajar & Enfrentar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
