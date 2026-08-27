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
      className="painel-lateral-detalhes-estado sidebar-detalhes-estado absolute right-3 sm:right-6 top-16 max-h-[calc(100vh-210px)] w-80 sm:w-96 z-30 flex flex-col pointer-events-auto select-none animate-fadeIn"
      style={{
        isolation: 'isolate',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'geometricPrecision',
      }}
    >
      <div className="card-detalhes-conteudo relative flex-1 flex flex-col bg-slate-950 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_24px_rgba(245,158,11,0.3)] overflow-hidden transition-all duration-300">
        {/* Glow ambient background aura */}
        <div
          className={`aura-fundo-sidebar absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isCompleted ? 'bg-amber-500/25' : 'bg-yellow-500/20'
          }`}
        />

        {/* Active State / Hovered State View */}
        <div className="secao-estado-ativo flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1 gap-3">
          {/* Header with State Crest & Titles */}
          <div>
            <div className="flex items-start gap-3 mb-2.5">
              {/* State Coat of Arms with Gold Embellished Shield */}
              <div
                className={`moldura-brasao-sidebar relative w-14 h-18 rounded-b-xl rounded-t-sm flex items-center justify-center p-1.5 shadow-xl transition-transform duration-300 hover:scale-105 shrink-0 ${
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
                  <Shield className="w-8 h-8 text-amber-400" />
                )}

                <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="pill-sigla-uf px-2 py-0.5 rounded text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono">
                    {currentGuardian.id}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {stateRegistry?.region || geoInfo?.region || 'Brasil'}
                  </span>
                </div>

                <h3 className="titulo-estado text-base sm:text-lg font-bold text-white tracking-wide truncate">
                  {currentGuardian.stateNamePt}
                </h3>

                <p className="subtitulo-guardiao text-xs sm:text-sm text-amber-400 font-medium truncate flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {currentGuardian.guardianTitlePt}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`tag-status-conquista mb-3 px-3 py-1 rounded-xl flex items-center justify-between text-xs font-semibold border ${
                isCompleted
                  ? 'bg-amber-500/20 border-amber-400/70 text-amber-300'
                  : 'bg-slate-900 border-slate-700/80 text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
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
              <span className="text-xs text-amber-400 font-mono font-black">+100 XP</span>
            </div>

            {/* Capital, Time, Climate, Lat/Long 4-Box Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              {/* Capital & Local Time */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Landmark className="w-3 h-3 text-amber-400" />
                    Capital
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {localTimeString}
                  </span>
                </div>
                <div className="font-bold text-slate-100 text-sm truncate">
                  {capitalData?.capital || stateRegistry?.capital || geoInfo?.capital || '—'}
                </div>
              </div>

              {/* Climate */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-1">
                  <CloudSun className="w-3 h-3 text-sky-400" />
                  Clima
                </div>
                <div className="font-bold text-slate-200 text-sm truncate" title={capitalData?.defaultClimate || 'Tropical'}>
                  {capitalData?.defaultClimate || 'Tropical'}
                </div>
              </div>

              {/* Coordinates Lat / Lng */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col justify-between col-span-2">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    Coordenadas da Capital
                  </span>
                  <span className="text-[11px] text-amber-300">
                    {capitalData?.typicalFlower ? `${capitalData.typicalFlower.icon} ${capitalData.typicalFlower.name}` : ''}
                  </span>
                </div>
                <div className="font-mono text-emerald-300 font-bold text-xs sm:text-sm">
                  {latFormatted} • {lngFormatted}
                </div>
              </div>
            </div>

            {/* Lore / Story Snippet */}
            <div className="caixa-lore-estado bg-slate-900 border border-amber-500/30 rounded-xl p-2.5 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                <BookOpen className="w-3 h-3 text-amber-400" />
                Tradições do Guardião
              </div>
              <p className="text-xs text-slate-200 leading-relaxed line-clamp-3 font-serif">
                {currentGuardian.loreStoryPt || currentGuardian.garbDescriptionPt}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="btn-sidebar-viajar-estado"
            onClick={() => onSelectGuardian(currentGuardian)}
            className="btn-acao-viajar-estado w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer shrink-0"
          >
            <span>{isCompleted ? 'Revisitar Guardião' : 'Viajar & Desafiar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
