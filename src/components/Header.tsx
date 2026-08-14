import React, { useState } from 'react';
import { UserProgress, Language } from '../types';
import { calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';
import { Map, Shield, Trophy, Settings, ChevronDown } from 'lucide-react';

interface Props {
  progress: UserProgress;
  activeTab: 'map' | 'insignias';
  setActiveTab: (tab: 'map' | 'insignias') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<Props> = ({
  progress,
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { level, currentXpInLevel, xpForNextLevel, titlePt } = calculateLevel(progress.xp);
  const xpPercentage = Math.min(100, Math.round((currentXpInLevel / xpForNextLevel) * 100));

  // If in insignias sanctuary or settings, keep open; otherwise slide down on proximity/hover
  const isExpanded = isHovered || activeTab === 'insignias';

  return (
    <div
      className="container-proximidade-cabecalho fixed top-0 left-0 right-0 z-50 pointer-events-auto group/header-proximity"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Main Collapsible Header Bar (Slides down on proximity) */}
      <header
        className={`menu-superior-status cabecalho-principal-rpg bg-slate-950/95 backdrop-blur-xl border-b-2 border-amber-500/50 shadow-2xl transition-all duration-300 ease-out transform ${
          isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Logo & Title */}
            <div className="grupo-logotipo-titulo flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3">
                <div className="icone-logo-brasil w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-amber-400">
                    🇧🇷
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="titulo-app font-serif font-black text-base sm:text-lg text-amber-400 tracking-wider">
                      SÍMBOLOS BR
                    </h1>
                    <span className="badge-genero-rpg bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest font-serif">
                      RPG Medieval
                    </span>
                  </div>
                  <p className="subtitulo-app text-[11px] text-slate-300 font-serif">
                    Jornada dos Guardiões da Cultura Brasileira
                  </p>
                </div>
              </div>

              {/* Level Badge Mobile */}
              <div className="badge-nivel-mobile md:hidden flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-serif font-bold text-amber-300">Nív {level}</span>
              </div>
            </div>

            {/* XP Progress Bar (Desktop) */}
            <div className="painel-xp-jogador hidden md:flex items-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-2xl border border-amber-500/40 shadow-inner">
              <div className="badge-nivel-desktop w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                {level}
              </div>
              <div className="w-44 space-y-1">
                <div className="flex justify-between text-[10px] font-serif font-bold">
                  <span className="titulo-rpg-jogador text-amber-400">{titlePt}</span>
                  <span className="texto-xp-atual text-slate-300">{progress.xp} XP</span>
                </div>
                <div className="barra-progresso-xp w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-amber-900/60">
                  <div
                    className="preenchimento-progresso-xp bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="menu-navegacao-abas flex items-center gap-2 w-full md:w-auto justify-center">
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  setActiveTab('map');
                }}
                className={`btn-aba-mapa px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition shadow-md ${
                  activeTab === 'map'
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 border-2 border-amber-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Mapa do Brasil</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  setActiveTab('insignias');
                }}
                className={`btn-aba-santuario-insignias px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition shadow-md ${
                  activeTab === 'insignias'
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 border-2 border-amber-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Santuário ({progress.unlockedInsigniaIds.length}/27)</span>
              </button>

              {onOpenSettings && (
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenSettings();
                  }}
                  className="btn-abrir-configuracoes px-3 py-2 rounded-xl text-xs font-serif font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 transition shadow-md flex items-center gap-1.5"
                  title="Configurações & Áudio"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline">Ajustes</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. Top Hover Proximity Trigger & Compact Hanging Jewel Tab */}
      <div className="flex justify-center pointer-events-auto">
        <button
          onClick={() => setIsHovered((prev) => !prev)}
          className={`alca-suspensa-menu flex items-center gap-2 px-4 py-1 rounded-b-2xl bg-slate-950/90 hover:bg-slate-900 text-amber-400 border-x border-b border-amber-500/40 shadow-xl text-xs font-serif font-bold transition-all duration-300 cursor-pointer ${
            isExpanded ? 'opacity-40 hover:opacity-100 -translate-y-1' : 'opacity-90 hover:opacity-100 translate-y-0 scale-105'
          }`}
          title="Passe o mouse para abrir o Menu Superior"
        >
          <span className="text-sm">🇧🇷</span>
          <span className="tracking-wide">SÍMBOLOS BR</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
            Nív {level}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-300' : 'text-amber-400'}`} />
        </button>
      </div>
    </div>
  );
};
