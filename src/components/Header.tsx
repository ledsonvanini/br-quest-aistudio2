import React from 'react';
import { UserProgress, Language } from '../types';
import { calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';
import { Map, Shield, Trophy, Settings, Sparkles, Package } from 'lucide-react';

interface Props {
  progress: UserProgress;
  activeTab: 'map' | 'insignias';
  setActiveTab: (tab: 'map' | 'insignias') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenSettings?: () => void;
  isClimateActive?: boolean;
}

export const Header: React.FC<Props> = ({
  progress,
  activeTab,
  setActiveTab,
  onOpenSettings,
  isClimateActive = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { level, currentXpInLevel, xpForNextLevel, titlePt } = calculateLevel(progress.xp);
  const xpPercentage = Math.min(100, Math.round((currentXpInLevel / xpForNextLevel) * 100));

  // If in Climate & Environment mode, keep top area dedicated for the Meteorological banner
  if (isClimateActive) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Hover Trigger Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-500/20 via-amber-400/40 to-amber-500/20 cursor-pointer" />

      <header
        id="header-superior-navegacao"
        className={`header-superior-navegacao menu-superior-status w-full bg-slate-950/95 backdrop-blur-md border-b border-amber-500/40 shadow-xl select-none transition-transform duration-300 ease-out ${
          isHovered ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. Logotipo e Título Nobre */}
        <div
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('map');
            window.location.hash = '#/mapa';
          }}
          className="grupo-logotipo-titulo flex items-center gap-2.5 cursor-pointer group"
          title="Ir para a Página Inicial / Mapa do Brasil"
        >
          <div className="icone-logo-brasil w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-base sm:text-lg font-black text-amber-300">
              🇧🇷
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="titulo-app font-serif font-black text-xs sm:text-sm text-amber-300 tracking-wider group-hover:text-yellow-200 transition-colors">
                SÍMBOLOS BR
              </h1>
              <span className="badge-genero-rpg bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[9px] font-bold px-1.5 py-0.2 rounded font-serif uppercase tracking-wider">
                RPG Cívico
              </span>
            </div>
            <p className="subtitulo-app text-[9px] sm:text-[10px] text-slate-400 font-serif hidden sm:block">
              Guardiões & Relíquias da Cultura Brasileira
            </p>
          </div>
        </div>

        {/* 2. Barra de XP do Jogador (Central) */}
        <div
          id="painel-xp-jogador-header"
          className="painel-xp-jogador flex items-center gap-2.5 sm:gap-3 bg-slate-900/90 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-500/30 shadow-inner"
          title={`Nível ${level} (${progress.xp} XP acumulados) - ${titlePt}`}
        >
          <div className="badge-nivel-desktop w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-serif font-black text-xs shrink-0">
            {level}
          </div>
          <div className="w-24 sm:w-36 md:w-44 space-y-0.5">
            <div className="flex justify-between text-[9px] sm:text-[10px] font-serif font-bold">
              <span className="titulo-rpg-jogador text-amber-300 truncate max-w-[100px] sm:max-w-[130px]">
                {titlePt}
              </span>
              <span className="texto-xp-atual text-slate-400 font-mono">
                {progress.xp} XP
              </span>
            </div>
            <div className="barra-progresso-xp w-full bg-slate-950 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="preenchimento-progresso-xp bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Navegação Principal e Ajustes */}
        <nav
          id="menu-navegacao-abas"
          className="menu-navegacao-abas flex items-center gap-1.5 sm:gap-2"
        >
          {/* Aba Mapa do Brasil */}
          <button
            id="btn-aba-mapa"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveTab('map');
              window.location.hash = '#/mapa';
            }}
            className={`btn-aba-mapa px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-amber-200 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mapa do Brasil</span>
            <span className="sm:hidden">Mapa</span>
          </button>

          {/* Aba Santuário de Insígnias & Baú */}
          <button
            id="btn-aba-santuario-insignias"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveTab('insignias');
              window.location.hash = '#/insignias';
            }}
            className={`btn-aba-santuario-insignias px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              activeTab === 'insignias'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-amber-200 border-slate-800 hover:border-amber-500/40'
            }`}
            title="Santuário das Insígnias & Grande Baú de Relíquias da Nação"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Santuário & Baú</span>
            <span className="md:hidden">Santuário</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'insignias'
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}
            >
              {progress.unlockedInsigniaIds.length}/27
            </span>
          </button>

          {/* Botão de Ajustes */}
          {onOpenSettings && (
            <button
              id="btn-abrir-configuracoes"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenSettings();
              }}
              className="btn-abrir-configuracoes p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-serif font-bold bg-slate-900 text-amber-400 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/60 transition cursor-pointer flex items-center gap-1"
              title="Configurações de Áudio & Sistema"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline text-[11px]">Ajustes</span>
            </button>
          )}
        </nav>

      </div>
    </header>
    </div>
  );
};

