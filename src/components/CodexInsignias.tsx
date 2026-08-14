import React, { useState } from 'react';
import { UserProgress, Language } from '../types';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { Shield, Lock, Award, BookOpen, Sparkles, CheckCircle, Search } from 'lucide-react';

interface Props {
  progress: UserProgress;
  lang: Language;
}

export const CodexInsignias: React.FC<Props> = ({ progress, lang }) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredGuardians = GUARDIANS_DATA.filter((g) => {
    const matchesRegion = filterRegion === 'all' || g.regionId === filterRegion;
    const matchesSearch =
      g.stateNamePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.guardianTitlePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const unlockedCount = progress.unlockedInsigniaIds.length;

  return (
    <div className="container-santuario-insignias flex-1 h-full overflow-y-auto scrollbar-none mask-vertical-fade space-y-4 pr-1 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-4 sm:p-6 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Coleção de Insígnias dos Guardiões</span>
          </div>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white">
            Santuário das Insígnias Sagradas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Complete os Desafios dos Guardiões de cada estado para desbloquear as 27 Insígnias Sagradas que restauram a memória patriótica do Brasil.
          </p>
        </div>

        {/* Progress Counter Badge */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 text-center min-w-[180px] shadow-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Insígnias Raras</div>
          <div className="font-outfit font-black text-3xl text-amber-400 flex items-center justify-center gap-2">
            <span>{unlockedCount}</span>
            <span className="text-slate-600 font-normal text-xl">/ 27</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${(unlockedCount / 27) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Region Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'norte', label: 'Norte' },
            { id: 'nordeste', label: 'Nordeste' },
            { id: 'centro_oeste', label: 'Centro-Oeste' },
            { id: 'sudeste', label: 'Sudeste' },
            { id: 'sul', label: 'Sul' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setFilterRegion(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                filterRegion === r.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por estado..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Insignia Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuardians.map((guardian) => {
          const isUnlocked = progress.unlockedInsigniaIds.includes(guardian.id);

          return (
            <div
              key={guardian.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-xl hover:border-amber-400'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{guardian.flagSymbol}</span>
                    <div>
                      <h4 className="font-outfit font-extrabold text-base text-white">
                        {guardian.stateNamePt} ({guardian.id})
                      </h4>
                      <p className="text-[11px] text-slate-400">{guardian.guardianTitlePt}</p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-yellow-400 border-amber-400 shadow-md'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {isUnlocked ? guardian.insigniaIcon : <Lock className="w-5 h-5 text-slate-600" />}
                  </div>
                </div>

                {/* Insignia Name & Description */}
                <div className="space-y-1 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>{guardian.insigniaNamePt}</span>
                  </div>
                  <p className="text-xs text-slate-300">{guardian.insigniaDescPt}</p>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Desbloqueada
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Interaja no Mapa & Vença o Quiz</span>
                )}
                <span className="text-slate-400 font-mono text-[10px]">{guardian.capitalPt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
