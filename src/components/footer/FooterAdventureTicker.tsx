import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Crosshair,
  Trophy,
  Trees,
  Sun,
  Flame,
  Building2,
  Mountain,
  Search,
} from 'lucide-react';
import { StateSearchSelectorModal } from '../map/StateSearchSelectorModal';
import { audioEngine } from '../../lib/audioSynth';
import { REGION_STATES_MAP } from '../map/stateStyling/stateFillStyler';

interface FooterAdventureTickerProps {
  completedSet: Set<string>;
  onStateClick: (stateId: string) => void;
  selectedCampaign?: string;
  onSelectCampaign?: (campaign: string) => void;
}

const STATE_APPROX_COORDS: Record<string, [number, number]> = {
  AC: [-9.0, -70.0], AL: [-9.5, -36.5], AM: [-3.5, -62.0], AP: [1.0, -52.0],
  BA: [-12.5, -41.5], CE: [-5.0, -39.5], DF: [-15.8, -47.9], ES: [-20.0, -40.5],
  GO: [-16.0, -49.5], MA: [-5.0, -45.0], MG: [-18.5, -44.0], MS: [-20.5, -54.5],
  MT: [-13.0, -56.0], PA: [-4.0, -53.0], PB: [-7.0, -36.5], PE: [-8.5, -37.5],
  PI: [-7.0, -42.5], PR: [-24.5, -51.5], RJ: [-22.5, -42.5], RN: [-5.5, -36.5],
  RO: [-11.0, -63.0], RR: [2.0, -61.0], RS: [-30.0, -53.5], SC: [-27.0, -50.5],
  SE: [-10.5, -37.5], SP: [-22.5, -48.5], TO: [-10.0, -48.0],
};

const STATE_TO_REGION: Record<string, string> = {
  AC: 'norte', AP: 'norte', AM: 'norte', PA: 'norte', RO: 'norte', RR: 'norte', TO: 'norte',
  AL: 'nordeste', BA: 'nordeste', CE: 'nordeste', MA: 'nordeste', PB: 'nordeste', PE: 'nordeste', PI: 'nordeste', RN: 'nordeste', SE: 'nordeste',
  DF: 'centro_oeste', GO: 'centro_oeste', MS: 'centro_oeste', MT: 'centro_oeste',
  ES: 'sudeste', MG: 'sudeste', RJ: 'sudeste', SP: 'sudeste',
  PR: 'sul', RS: 'sul', SC: 'sul',
};

const REGION_BUTTONS = [
  { id: 'norte', short: 'N', label: 'Região Norte (7 Estados)', icon: Trees, color: 'text-emerald-400' },
  { id: 'nordeste', short: 'NE', label: 'Região Nordeste (9 Estados)', icon: Sun, color: 'text-amber-400' },
  { id: 'centro_oeste', short: 'CO', label: 'Região Centro-Oeste (4 Estados)', icon: Flame, color: 'text-yellow-400' },
  { id: 'sudeste', short: 'SE', label: 'Região Sudeste (4 Estados)', icon: Building2, color: 'text-sky-400' },
  { id: 'sul', short: 'S', label: 'Região Sul (3 Estados)', icon: Mountain, color: 'text-indigo-400' },
] as const;

function findClosestState(lat: number, lon: number): string {
  let closest = 'SP';
  let minDist = Infinity;
  for (const [st, [sLat, sLon]] of Object.entries(STATE_APPROX_COORDS)) {
    const d = Math.hypot(lat - sLat, lon - sLon);
    if (d < minDist) {
      minDist = d;
      closest = st;
    }
  }
  return closest;
}

export const FooterAdventureTicker: React.FC<FooterAdventureTickerProps> = ({
  completedSet,
  onStateClick,
  selectedCampaign = 'livre',
  onSelectCampaign,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hasAttemptedGps = useRef(false);

  // Keyboard shortcut Ctrl+K / Cmd+K to open stylish search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Solicitação implícita de GPS na montagem
  useEffect(() => {
    if (hasAttemptedGps.current) return;
    hasAttemptedGps.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const closestSt = findClosestState(pos.coords.latitude, pos.coords.longitude);
          const userRegion = STATE_TO_REGION[closestSt] || 'livre';
          setDetectedState(closestSt);
          if (onSelectCampaign) {
            onSelectCampaign(userRegion);
          }
        },
        () => {
          // Se o usuário recusar ou falhar, ativa modo livre suavemente
          if (onSelectCampaign && (!selectedCampaign || selectedCampaign === 'todos')) {
            onSelectCampaign('livre');
          }
        },
        { enableHighAccuracy: false, timeout: 6000 }
      );
    } else {
      if (onSelectCampaign && (!selectedCampaign || selectedCampaign === 'todos')) {
        onSelectCampaign('livre');
      }
    }
  }, [onSelectCampaign, selectedCampaign]);

  // Handler para acionamento manual do GPS
  const handleManualGeolocation = () => {
    if (!navigator.geolocation) {
      if (onSelectCampaign) onSelectCampaign('livre');
      return;
    }

    setIsLocating(true);
    audioEngine.playSfx('click');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const closestSt = findClosestState(pos.coords.latitude, pos.coords.longitude);
        const userRegion = STATE_TO_REGION[closestSt] || 'livre';
        setDetectedState(closestSt);
        if (onSelectCampaign) onSelectCampaign(userRegion);
        onStateClick(closestSt);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation denied or unavailable:', err.message);
        if (onSelectCampaign) onSelectCampaign('livre');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Cálculo do progresso da campanha ativa
  const campaignStates =
    selectedCampaign && selectedCampaign !== 'todos' && selectedCampaign !== 'livre'
      ? REGION_STATES_MAP[selectedCampaign] || []
      : Object.keys(STATE_APPROX_COORDS);

  const completedCount = campaignStates.filter((st) => completedSet.has(st)).length;
  const totalCount = campaignStates.length;
  const isAllConquered = completedCount === totalCount && totalCount > 0;

  return (
    <>
      <div
        id="painel-aventura-ticker-rodape"
        className="painel-aventura-ticker-rodape flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-slate-950/95 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-150 max-w-[96vw] sm:max-w-max overflow-x-auto no-scrollbar shrink-0 select-none text-slate-200"
        role="toolbar"
        aria-label="Controles da Aventura dos Guardiões"
      >
        {/* 1. Botão de Pesquisa Estilosa com Atalho Ctrl+K */}
        <button
          id="btn-abrir-seletor-estados"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            setIsSearchOpen(true);
          }}
          className={`btn-abrir-seletor-estados flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
            isSearchOpen
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-bold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border-amber-500/30 hover:border-amber-400/60'
          }`}
          title="Abrir Seletor de Estados e Guardiões (Ctrl+K)"
          aria-label="Buscar Estado no Mapa (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

        {/* 2. Modo Livre (Ícone Bússola) */}
        <button
          id="btn-modo-campanha-livre"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            if (onSelectCampaign) onSelectCampaign('livre');
          }}
          className={`btn-modo-campanha-livre p-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1 cursor-pointer border ${
            selectedCampaign === 'livre' || selectedCampaign === 'todos'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] font-bold'
              : 'bg-slate-900/90 text-amber-200/80 hover:bg-slate-800 border-amber-500/30 hover:border-amber-400/50'
          }`}
          title="Modo Livre: Explorar todo o Brasil sem restrição de fronteiras"
          aria-label="Modo Livre"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden xs:inline text-[11px]">Livre</span>
        </button>

        {/* 3. Botão GPS Cartográfico (Geolocalização / Detecção de Região) */}
        <button
          id="btn-geolocalizacao-gps"
          type="button"
          onClick={handleManualGeolocation}
          disabled={isLocating}
          className={`btn-geolocalizacao-gps p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 ${
            isLocating
              ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
              : detectedState
              ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-400/60'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border-slate-800 hover:border-amber-500/40'
          }`}
          title={
            detectedState
              ? `Localização detectada: ${detectedState} (${STATE_TO_REGION[detectedState] || 'BR'}). Clique para re-detectar.`
              : 'Detectar minha região via GPS do navegador'
          }
          aria-label="Geolocalização GPS"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
        </button>

        <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

        {/* 4. Seletores Compactos de Região (Foco em Ícones e Siglas) */}
        <div className="seletor-regioes-rodape flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 shrink-0">
          {REGION_BUTTONS.map((reg) => {
            const isRegActive = selectedCampaign === reg.id;
            const Icon = reg.icon;

            return (
              <button
                key={reg.id}
                id={`btn-campanha-regiao-${reg.id}`}
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  if (onSelectCampaign) onSelectCampaign(reg.id);
                }}
                className={`btn-campanha-regiao flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                  isRegActive
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] font-extrabold scale-105'
                    : 'bg-slate-900/90 border-transparent text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                }`}
                title={reg.label}
                aria-label={reg.label}
              >
                <Icon className={`w-3 h-3 ${isRegActive ? 'text-slate-950' : reg.color}`} />
                <span>{reg.short}</span>
              </button>
            );
          })}
        </div>

        <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

        {/* 5. Indicador de Progresso Compacto */}
        <div
          id="indicador-progresso-conquista"
          className="indicador-progresso-conquista flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-amber-500/30 text-[11px] font-mono shrink-0"
          title={
            isAllConquered
              ? 'Região Concluída com Sucesso!'
              : `Progresso: ${completedCount} de ${totalCount} estados concluídos`
          }
        >
          <Trophy className={`w-3.5 h-3.5 ${isAllConquered ? 'text-emerald-400 animate-bounce' : 'text-amber-400'}`} />
          <span className={isAllConquered ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Menu Seletor Estiloso de Estados (Ctrl+K) */}
      <StateSearchSelectorModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        completedStateIds={completedSet}
        onStateClick={onStateClick}
      />
    </>
  );
};

