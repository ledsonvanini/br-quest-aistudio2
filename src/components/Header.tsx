import React from 'react';
import { UserProgress, Language } from '../types';
import { calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';
import { Map, Shield, Trophy, Settings } from 'lucide-react';

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
  const { level, currentXpInLevel, xpForNextLevel, titlePt } = calculateLevel(progress.xp);
  const xpPercentage = Math.min(100, Math.round((currentXpInLevel / xpForNextLevel) * 100));

  return (
    <header className="bg-slate-950 border-b-2 border-amber-500/50 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-400">
                  🇧🇷
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-lg sm:text-xl text-amber-400 tracking-wider">
                    SÍMBOLOS BR
                  </h1>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest font-serif">
                    RPG Medieval
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-serif">Jornada dos Guardiões da Cultura Brasileira</p>
              </div>
            </div>

            {/* Level Badge Mobile */}
            <div className="md:hidden flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-serif font-bold text-amber-300">Nív {level}</span>
            </div>
          </div>

          {/* XP Progress Bar (Desktop) */}
          <div className="hidden md:flex items-center gap-4 bg-slate-900/90 px-4 py-2 rounded-2xl border border-amber-500/40 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-serif font-bold text-base">
              {level}
            </div>
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-[10px] font-serif font-bold">
                <span className="text-amber-400">{titlePt}</span>
                <span className="text-slate-300">{progress.xp} XP</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-amber-900/60">
                <div
                  className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-center">
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                setActiveTab('map');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold flex items-center gap-2 transition shadow-md ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 border-2 border-amber-300'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Mapa do Brasil RPG</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playSfx('click');
                setActiveTab('insignias');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold flex items-center gap-2 transition shadow-md ${
                activeTab === 'insignias'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 border-2 border-amber-300'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Santuário ({progress.unlockedInsigniaIds.length}/27)</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onOpenSettings();
                }}
                className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 transition shadow-md flex items-center gap-1.5"
                title="Configurações & Áudio"
              >
                <Settings className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline">Ajustes</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
