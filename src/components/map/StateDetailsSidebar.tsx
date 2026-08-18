import React, { useMemo } from 'react';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
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
  Clock,
  CloudSun,
  Navigation,
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
  const capitalData = STATE_CAPITAL_GEO_DATA[activeStateId];

  if (!currentGuardian) return null;

  const isCompleted = completedStateIds.has(activeStateId);
  const coatUrl = getStateCoatOfArmsUrl(activeStateId) || stateRegistry?.coatOfArmsUrl || '';

  // Local time calculation (Brazil standard UTC-3, or UTC-4 for Acre/Amazonas)
  const localTimeString = useMemo(() => {
    const now = new Date();
    // Default to Brasília time (UTC-3)
    let offsetHours = -3;
    if (activeStateId === 'AC') offsetHours = -5;
    else if (['AM', 'RR', 'RO', 'MT', 'MS'].includes(activeStateId)) offsetHours = -4;
    else if (activeStateId === 'FN') offsetHours = -2;

    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const targetDate = new Date(utcTime + 3600000 * offsetHours);
    return targetDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }, [activeStateId]);

  const latFormatted = capitalData?.lat ? `${Math.abs(capitalData.lat).toFixed(2)}° ${capitalData.lat < 0 ? 'S' : 'N'}` : '';
  const lngFormatted = capitalData?.lng ? `${Math.abs(capitalData.lng).toFixed(2)}° ${capitalData.lng < 0 ? 'O' : 'L'}` : '';

  return (
    <aside
      id="sidebar-detalhes-estado"
      className="painel-lateral-detalhes-estado sidebar-detalhes-estado absolute right-3 sm:right-5 top-16 max-h-[calc(100vh-230px)] w-64 sm:w-72 z-30 flex flex-col pointer-events-auto select-none animate-fadeIn"
    >
      <div className="card-detalhes-conteudo relative flex-1 flex flex-col bg-slate-950/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300">
        {/* Glow ambient background aura */}
        <div
          className={`aura-fundo-sidebar absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isCompleted ? 'bg-amber-500/25' : 'bg-yellow-500/20'
          }`}
        />

        {/* Active State / Hovered State View */}
        <div className="secao-estado-ativo flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1 gap-2">
          {/* Header with State Crest & Titles */}
          <div>
            <div className="flex items-start gap-2.5 mb-2">
              {/* State Coat of Arms with Gold Embellished Shield */}
              <div
                className={`moldura-brasao-sidebar relative w-12 h-16 rounded-b-xl rounded-t-sm flex items-center justify-center p-1 shadow-xl transition-transform duration-300 hover:scale-105 shrink-0 ${
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
                  <Shield className="w-6 h-6 text-amber-400" />
                )}

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

                <h3 className="titulo-estado text-sm font-bold text-white tracking-wide truncate">
                  {currentGuardian.stateNamePt}
                </h3>

                <p className="subtitulo-guardiao text-[10.5px] text-amber-400/90 font-medium truncate flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  {currentGuardian.guardianTitlePt}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`tag-status-conquista mb-2 px-2 py-0.5 rounded-lg flex items-center justify-between text-[10px] font-semibold border ${
                isCompleted
                  ? 'bg-amber-500/15 border-amber-400/60 text-amber-300'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1">
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    Reino Desbravado
                  </>
                ) : (
                  <>
                    <Compass className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '10s' }} />
                    Pronto para Desafio
                  </>
                )}
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">+100 XP</span>
            </div>

            {/* Capital, Time, Climate, Lat/Long 4-Box Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-2 text-[10px]">
              {/* Capital & Local Time */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Landmark className="w-2.5 h-2.5 text-amber-400" />
                    Capital
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-300/90 font-mono">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    {localTimeString}
                  </span>
                </div>
                <div className="font-bold text-slate-100 truncate">
                  {capitalData?.capital || stateRegistry?.capital || geoInfo?.capital || '—'}
                </div>
              </div>

              {/* Climate */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between">
                <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                  <CloudSun className="w-2.5 h-2.5 text-sky-400" />
                  Clima
                </div>
                <div className="font-bold text-slate-200 truncate" title={capitalData?.defaultClimate || 'Tropical'}>
                  {capitalData?.defaultClimate || 'Tropical'}
                </div>
              </div>

              {/* Coordinates Lat / Lng */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between col-span-2">
                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                    Coordenadas da Capital
                  </span>
                  <span className="text-[9px] text-amber-300/80">
                    {capitalData?.typicalFlower ? `${capitalData.typicalFlower.icon} ${capitalData.typicalFlower.name}` : ''}
                  </span>
                </div>
                <div className="font-mono text-emerald-300 font-medium">
                  {latFormatted} • {lngFormatted}
                </div>
              </div>
            </div>

            {/* Lore / Story Snippet */}
            <div className="caixa-lore-estado bg-slate-900/90 border border-amber-500/20 rounded-xl p-2 mb-1.5">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 mb-0.5">
                <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                Tradições do Guardião
              </div>
              <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                {currentGuardian.loreStoryPt || currentGuardian.garbDescriptionPt}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="btn-sidebar-viajar-estado"
            onClick={() => onSelectGuardian(currentGuardian)}
            className="btn-acao-viajar-estado w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer shrink-0"
          >
            <span>{isCompleted ? 'Revisitar Guardião' : 'Viajar & Desafiar'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
