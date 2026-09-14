import React from 'react';
import { BrazilBiome } from '../../../types';
import { UserFavorites } from '../../../types/userPreferences';
import { ALL_BRAZIL_SPECIMENS } from '../../../data/brazilBiodiversityData';
import { BRAZIL_STATES_REGISTRY } from '../../../data/brazilStatesRegistry';
import { BIOME_VISUAL_REGISTRY } from '../common/specimenVisualMap';
import { SpecimenAvatar } from '../common/SpecimenAvatar';
import { Compass, Sparkles, MapPin, TreePine, ArrowRight, Award, ShieldCheck, Heart } from 'lucide-react';

interface ExplorerOverviewTabProps {
  favorites: UserFavorites;
  playerLevel: number;
  completedStatesCount: number;
  unlockedInsigniaCount: number;
  onNavigateToState?: (stateId: string) => void;
  onSwitchTab: (tab: 'favorites' | 'history' | 'preferences' | 'identity') => void;
}

export const ExplorerOverviewTab: React.FC<ExplorerOverviewTabProps> = ({
  favorites,
  completedStatesCount,
  unlockedInsigniaCount,
  onNavigateToState,
  onSwitchTab,
}) => {
  // Estado recomendado: pega o primeiro estado favorito ou um estado emblemático não explorado ainda
  const recommendedStateId = favorites.stateIds[0] || 'AM';
  const recommendedState = BRAZIL_STATES_REGISTRY[recommendedStateId] || BRAZIL_STATES_REGISTRY['AM'];

  // Espécies favoritas selecionadas
  const favoriteSpecimens = ALL_BRAZIL_SPECIMENS.filter((s) =>
    favorites.speciesIds.includes(s.id)
  ).slice(0, 4);

  return (
    <div className="painel-aba-visao-geral space-y-5 text-stone-200 text-sm">
      {/* 1. Card de Destaque: Próxima Parada da Expedição */}
      <div className="card-expedicao-destaque p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-850 to-stone-900 border border-amber-500/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex-shrink-0">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Destino Recomendado para Você
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-100 mt-0.5">
              Expedição: {recommendedState.name} ({recommendedState.id})
            </h3>
            <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
              Capital {recommendedState.capital} • Região {recommendedState.region}. Desvende os biomas, hinos e desafios do Guardião para coletar mais insígnias territoriais.
            </p>
          </div>
        </div>

        {onNavigateToState && (
          <button
            type="button"
            id="btn-viajar-estado-recomendado"
            onClick={() => onNavigateToState(recommendedState.id)}
            className="btn-acao-viajar-estado self-start md:self-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition shadow-md flex-shrink-0"
          >
            <span>Viajar Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Resumo de Afinidades: Biomas & Espécies Guardiãs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Biomas de Afinidade */}
        <div className="p-4 rounded-xl bg-stone-850/70 border border-stone-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <TreePine className="w-4 h-4" />
                <span>Seus Biomas de Afinidade</span>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab('favorites')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Editar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {favorites.biomes.slice(0, 4).map((biome: BrazilBiome) => {
                const visual = BIOME_VISUAL_REGISTRY[biome];
                return (
                  <div
                    key={biome}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 bg-gradient-to-r ${visual?.themeClass || 'from-stone-800 to-stone-900 border-stone-700 text-stone-200'}`}
                  >
                    <span className="text-xl flex-shrink-0">{visual?.icon || '🌿'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{biome}</div>
                      <div className="text-[10px] opacity-80 truncate">{visual?.tagline || 'Bioma Brasileiro'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Total de biomas marcados:</span>
            <span className="font-bold text-stone-200 font-mono">{favorites.biomes.length} de 7</span>
          </div>
        </div>

        {/* Espécies Guardiãs Selecionadas */}
        <div className="p-4 rounded-xl bg-stone-850/70 border border-stone-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>Fauna & Flora em Destaque</span>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab('favorites')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Ver Todas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {favoriteSpecimens.length > 0 ? (
                favoriteSpecimens.map((sp) => (
                  <div
                    key={sp.id}
                    className="p-2 rounded-xl bg-stone-800/80 border border-stone-700/50 flex items-center gap-3"
                  >
                    <SpecimenAvatar
                      specimenId={sp.id}
                      namePt={sp.namePt}
                      kingdom={sp.kingdom}
                      imageUrl={sp.imageUrl}
                      thumbnailUrl={sp.thumbnailUrl}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-200 truncate">{sp.namePt}</div>
                      <div className="text-[10px] text-stone-400 italic truncate">{sp.scientificName}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 font-mono">
                      {sp.iucnStatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-stone-500 text-xs">
                  Nenhuma espécie marcada ainda. Clique em "Editar" para favoritar espécies da fauna e flora!
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Espécies colecionadas:</span>
            <span className="font-bold text-stone-200 font-mono">{favorites.speciesIds.length} selecionadas</span>
          </div>
        </div>
      </div>

      {/* 3. Estados de Predileção com Bandeiras */}
      <div className="p-4 rounded-xl bg-stone-850/70 border border-stone-700/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Estados Favoritos ({favorites.stateIds.length} marcados)</span>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab('favorites')}
            className="text-xs text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Gerenciar Estados</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {favorites.stateIds.map((stId) => {
            const stInfo = BRAZIL_STATES_REGISTRY[stId];
            if (!stInfo) return null;
            return (
              <button
                key={stId}
                type="button"
                onClick={() => onNavigateToState && onNavigateToState(stId)}
                title={`Viajar para ${stInfo.name}`}
                className="p-2 rounded-xl bg-stone-800/90 hover:bg-stone-750 border border-stone-700 hover:border-sky-500/50 flex flex-col items-center justify-center gap-1 transition text-center group"
              >
                <img
                  src={`/flags/${stId.toLowerCase()}.svg`}
                  alt={stInfo.name}
                  className="w-6 h-4 object-cover rounded shadow-xs border border-stone-600 group-hover:scale-105 transition"
                />
                <span className="text-xs font-bold text-stone-200 group-hover:text-sky-300">{stId}</span>
                <span className="text-[9px] text-stone-400 truncate max-w-full">{stInfo.capital}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
