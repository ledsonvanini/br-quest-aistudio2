import React from 'react';
import {
  Globe2,
  Trophy,
  Zap,
  Thermometer,
  Trees,
  Users,
  Building2,
  Map,
  Radio,
  BookOpen,
  Flame,
  Search,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { EducationTier, QuestThemePillar } from '../../data/brQuestQuestionsData';
import { QuestCategory } from './BrQuestSidebar';
import { StateGuardian } from '../../types';
import { audioEngine } from '../../lib/audioSynth';

interface BrQuestHubContentProps {
  activeCategory: QuestCategory;
  activeSubTab: string;
  selectedDifficultyTier: EducationTier | 'todos';
  userLocation: { regionId: string } | null;
  filteredGuardians: StateGuardian[];
  guardianSearchQuery: string;
  setGuardianSearchQuery: (query: string) => void;
  onStartChallenge: (
    title: string,
    desc: string,
    filter: { scope?: 'nacional'; pillar?: QuestThemePillar; regionId?: any; stateId?: string },
    count?: number
  ) => void;
  onSelectGuardian: (guardian: StateGuardian) => void;
  onClose: () => void;
}

export const BrQuestHubContent: React.FC<BrQuestHubContentProps> = ({
  activeCategory,
  activeSubTab,
  selectedDifficultyTier,
  userLocation,
  filteredGuardians,
  guardianSearchQuery,
  setGuardianSearchQuery,
  onStartChallenge,
  onSelectGuardian,
  onClose,
}) => {
  return (
    <div className="conteudo-subtab-scroll flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar-gold">
      {/* CATEGORIA 1: PROVA NACIONAL */}
      {activeCategory === 'nacional' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Banner Principal da Grande Prova */}
          <div className="card-desafio-brquest relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-400/80 shadow-md group overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-35 transition-opacity pointer-events-none">
              <Globe2 className="w-36 h-36 text-amber-300" />
            </div>

            <div className="relative z-10 space-y-2.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow">
                  Desafio Oficial Brasil
                </span>
                <span className="text-xs text-amber-300 font-mono">6 Questões Multidisciplinares</span>
              </div>

              <h3 className="font-serif font-black text-base sm:text-xl text-amber-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>A Grande Prova do Brasil</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Simulado nacional integrando Rios Voadores, ZCAS, biomas endêmicos, demografia Censo IBGE e matrizes geopolíticas territoriais.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onStartChallenge(
                      'Grande Prova do Brasil',
                      'Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.',
                      { scope: 'nacional' },
                      6
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Iniciar Grande Prova (6 Qs)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onStartChallenge(
                      'Simulado Rápido do Brasil',
                      'Versão ágil de 3 questões com telemetria simplificada.',
                      { scope: 'nacional' },
                      3
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Simulado Rápido (3 Qs)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grade das 6 Especialidades Científicas Cobertas */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Eixos Temáticos Incluídos na Avaliação
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-200">Clima & Rios Voadores</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Biomas & Biodiversidade</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-200">Demografia Censo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-200">Geopolítica & Fronteiras</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Map className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">Geografia & Bacias ANA</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-slate-200">Cultura & Patrimônio</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIA 2: ÁREAS DO CONHECIMENTO (6 PILARES) */}
      {activeCategory === 'pilares' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Módulos por Área Científica</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">6 Especialidades</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                pilar: 'clima' as QuestThemePillar,
                label: 'Clima & Atmosfera',
                desc: 'Rios Voadores, ZCAS, frentes polares e telemetria CPTEC/ECMWF.',
                icon: Thermometer,
                color: 'border-sky-500/40 hover:border-sky-400 bg-gradient-to-br from-sky-950/40 to-slate-900',
                iconColor: 'text-sky-400',
              },
              {
                pilar: 'biodiversidade' as QuestThemePillar,
                label: 'Biomas & Biodiversidade',
                desc: 'Fauna endêmica, flora ameaçada e os 6 biomas do Brasil.',
                icon: Trees,
                color: 'border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-br from-emerald-950/40 to-slate-900',
                iconColor: 'text-emerald-400',
              },
              {
                pilar: 'demografia' as QuestThemePillar,
                label: 'Demografia IBGE',
                desc: 'Censo demográfico, pirâmide etária, povos originários e IDHM.',
                icon: Users,
                color: 'border-purple-500/40 hover:border-purple-400 bg-gradient-to-br from-purple-950/40 to-slate-900',
                iconColor: 'text-purple-400',
              },
              {
                pilar: 'geopolitica' as QuestThemePillar,
                label: 'Geopolítica & Fronteiras',
                desc: 'Tratados territoriais, 10 países vizinhos, Amazônia Azul e infraestrutura.',
                icon: Building2,
                color: 'border-indigo-500/40 hover:border-indigo-400 bg-gradient-to-br from-indigo-950/40 to-slate-900',
                iconColor: 'text-indigo-400',
              },
              {
                pilar: 'geografia' as QuestThemePillar,
                label: 'Geografia & Relevo',
                desc: 'Bacias hidrográficas ANA, divisores de água, serras e depressões.',
                icon: Map,
                color: 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-br from-amber-950/40 to-slate-900',
                iconColor: 'text-amber-400',
              },
              {
                pilar: 'cultura_musica' as QuestThemePillar,
                label: 'Cultura & Tradições',
                desc: 'Patrimônio histórico IPHAN, ritmos regionais, culinária e rádio tradicional.',
                icon: Radio,
                color: 'border-rose-500/40 hover:border-rose-400 bg-gradient-to-br from-rose-950/40 to-slate-900',
                iconColor: 'text-rose-400',
              },
            ]
              .filter((item) => activeSubTab === 'all' || item.pilar === activeSubTab)
              .map(({ pilar, label, desc, icon: Icon, color, iconColor }) => (
                <button
                  key={pilar}
                  type="button"
                  onClick={() =>
                    onStartChallenge(
                      `Módulo: ${label}`,
                      `Questões estruturadas sobre ${label} com dados oficiais atualizados.`,
                      { pillar: pilar },
                      5
                    )
                  }
                  className={`p-3.5 rounded-2xl border ${color} text-left transition hover:scale-[1.01] cursor-pointer flex flex-col justify-between gap-2.5 shadow-sm group`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <Icon className={`w-5 h-5 ${iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-amber-300">
                      5 Questões
                    </span>
                  </div>

                  <div>
                    <div className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-200">
                      {label}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-sans">
                      {desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                    <span className="text-amber-400/90 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Iniciar Módulo</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <span className="text-slate-400">
                      {selectedDifficultyTier === 'todos' ? 'Misto' : selectedDifficultyTier}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* CATEGORIA 3: TRILHAS REGIONAIS (5 REGIÕES) */}
      {activeCategory === 'trilhas' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Expedições pelas 5 Grandes Regiões</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Macro-Regiões IBGE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                id: 'norte',
                title: 'Trilha do Norte',
                sub: 'Amazônia, Bacia Amazônica, Carimbó e biodiversidade equatorial.',
                border: 'border-emerald-500/50 hover:border-emerald-400',
                bg: 'from-emerald-950/60 to-slate-900',
                badge: 'Norte (7 UFs)',
              },
              {
                id: 'nordeste',
                title: 'Trilha do Nordeste',
                sub: 'Caatinga, Sertão, Rio São Francisco, Frevo e culinária litorânea.',
                border: 'border-amber-500/50 hover:border-amber-400',
                bg: 'from-amber-950/60 to-slate-900',
                badge: 'Nordeste (9 UFs)',
              },
              {
                id: 'centro_oeste',
                title: 'Trilha do Centro-Oeste',
                sub: 'Pantanal, Cerrado, Planalto Central, bacias e agronegócio.',
                border: 'border-yellow-500/50 hover:border-yellow-400',
                bg: 'from-yellow-950/60 to-slate-900',
                badge: 'Centro-Oeste (4 UFs)',
              },
              {
                id: 'sudeste',
                title: 'Trilha do Sudeste',
                sub: 'Mata Atlântica, Serra do Mar, Metrópoles e Patrimônio Colonial.',
                border: 'border-blue-500/50 hover:border-blue-400',
                bg: 'from-blue-950/60 to-slate-900',
                badge: 'Sudeste (4 UFs)',
              },
              {
                id: 'sul',
                title: 'Trilha do Sul',
                sub: 'Pampa, Mata de Araucárias, Serras Gaúchas e bacias do Prata.',
                border: 'border-cyan-500/50 hover:border-cyan-400',
                bg: 'from-cyan-950/60 to-slate-900',
                badge: 'Sul (3 UFs)',
              },
            ]
              .filter((item) => activeSubTab === 'all' || item.id === activeSubTab)
              .map((trilha) => {
                const isUserRegion =
                  userLocation && userLocation.regionId.toLowerCase() === trilha.id.toLowerCase();
                return (
                  <button
                    key={trilha.id}
                    type="button"
                    onClick={() =>
                      onStartChallenge(
                        trilha.title,
                        `Questões específicas sobre a geografia, biomas e cultura da região ${trilha.badge}.`,
                        { regionId: trilha.id as any },
                        5
                      )
                    }
                    className={`p-3.5 rounded-2xl bg-gradient-to-br ${trilha.bg} border ${trilha.border} text-left transition hover:scale-[1.01] cursor-pointer flex flex-col justify-between gap-2.5 group shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-md bg-black/40 border border-amber-500/30">
                          {trilha.badge}
                        </span>
                        {isUserRegion && (
                          <span className="text-[9px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            Sua Região
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition" />
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-sm text-slate-100 mt-1">
                        {trilha.title}
                      </h5>
                      <p className="text-[11px] text-slate-300 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                        {trilha.sub}
                      </p>
                    </div>
                    <div className="text-[11px] font-mono text-amber-400 font-bold pt-1 border-t border-slate-800/60">
                      Iniciar Trilha Regional →
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* CATEGORIA 4: 27 GUARDIÕES ESTADUAIS */}
      {activeCategory === 'guardioes' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Campo de Busca Rápida de Guardião */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={guardianSearchQuery}
                onChange={(e) => setGuardianSearchQuery(e.target.value)}
                placeholder="Buscar UF, estado, capital ou Guardião..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition"
              />
            </div>
            <span className="text-[11px] font-mono text-amber-400">
              {filteredGuardians.length} de 27 Guardiões
            </span>
          </div>

          {/* Grade dos 27 Guardiões */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredGuardians.map((guardian) => (
              <button
                key={guardian.id}
                type="button"
                onClick={() => {
                  audioEngine.playSfx('travel');
                  onClose();
                  onSelectGuardian(guardian);
                }}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 text-left transition hover:scale-[1.01] cursor-pointer group shadow-sm flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={`/flags/${guardian.id.toLowerCase()}.svg`}
                      alt={guardian.stateNamePt}
                      className="w-5 h-3.5 object-cover rounded border border-slate-700 shadow-xs"
                    />
                    <span className="font-mono font-bold text-xs text-amber-300">{guardian.id}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400 capitalize">
                    {guardian.regionId}
                  </span>
                </div>

                <div>
                  <div className="font-serif font-bold text-xs text-slate-100 truncate group-hover:text-amber-200">
                    {guardian.stateNamePt}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {guardian.guardianName}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-sky-300/90 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>Cap. {guardian.capitalPt}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
