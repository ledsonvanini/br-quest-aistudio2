import React, { useState, useMemo } from 'react';
import { BrazilBiome, BiodiversitySpecimen } from '../../../types';
import { ALL_BRAZIL_SPECIMENS } from '../../../data/brazilBiodiversityData';
import { BRAZIL_STATES_REGISTRY, BrazilStateInfo } from '../../../data/brazilStatesRegistry';
import { BIOME_VISUAL_REGISTRY } from '../common/specimenVisualMap';
import { SpecimenAvatar } from '../common/SpecimenAvatar';
import { TreePine, Fish, MapPin, Heart, Check, Star, Search, Filter } from 'lucide-react';

interface ExplorerFavoritesTabProps {
  favoriteBiomes: BrazilBiome[];
  favoriteSpeciesIds: string[];
  favoriteStateIds: string[];
  onToggleBiome: (biome: BrazilBiome) => void;
  onToggleSpecies: (speciesId: string) => void;
  onToggleState: (stateId: string) => void;
  onNavigateToState?: (stateId: string) => void;
}

const AVAILABLE_BIOMES: BrazilBiome[] = [
  'Amazônia',
  'Cerrado',
  'Mata Atlântica',
  'Caatinga',
  'Pantanal',
  'Pampa',
  'Marinho Costeiro',
];

export const ExplorerFavoritesTab: React.FC<ExplorerFavoritesTabProps> = ({
  favoriteBiomes,
  favoriteSpeciesIds,
  favoriteStateIds,
  onToggleBiome,
  onToggleSpecies,
  onToggleState,
  onNavigateToState,
}) => {
  const [speciesSearch, setSpeciesSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'fauna' | 'flora' | 'threatened'>('all');

  const filteredSpecimens = useMemo(() => {
    return ALL_BRAZIL_SPECIMENS.filter((specimen) => {
      let matchesCategory = true;
      if (speciesFilter === 'fauna') matchesCategory = specimen.kingdom === 'fauna';
      else if (speciesFilter === 'flora') matchesCategory = specimen.kingdom === 'flora';
      else if (speciesFilter === 'threatened') {
        matchesCategory = ['CR', 'EN', 'VU'].includes(specimen.iucnStatus);
      }

      const query = speciesSearch.toLowerCase().trim();
      const matchesQuery =
        !query ||
        specimen.namePt.toLowerCase().includes(query) ||
        specimen.scientificName.toLowerCase().includes(query) ||
        specimen.biomes.some((b) => b.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [speciesSearch, speciesFilter]);

  return (
    <div className="painel-aba-favoritos space-y-6 text-stone-200 text-sm">
      {/* 1. Biomas Favoritos com Ícones Temáticos e Subtítulos */}
      <section className="secao-biomas-favoritos space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <TreePine className="w-4 h-4" />
            <span>Biomas Brasileiros de Afinidade ({favoriteBiomes.length} de 7)</span>
          </div>
          <span className="text-[11px] text-stone-400">Fixe para destacar no mapa</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {AVAILABLE_BIOMES.map((biome) => {
            const isFav = favoriteBiomes.includes(biome);
            const visual = BIOME_VISUAL_REGISTRY[biome];
            return (
              <button
                key={biome}
                type="button"
                onClick={() => onToggleBiome(biome)}
                className={`btn-favoritar-bioma p-3 rounded-xl border text-left flex flex-col justify-between transition min-h-[95px] relative overflow-hidden group ${
                  isFav
                    ? 'bg-gradient-to-b from-emerald-950/80 to-stone-900 border-emerald-500/70 text-emerald-100 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-stone-850/60 border-stone-700/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                    {visual?.icon || '🌿'}
                  </span>
                  {isFav ? (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 flex-shrink-0" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight line-clamp-1">{biome}</div>
                  <div className="text-[9px] text-stone-400/90 line-clamp-1 mt-0.5">{visual?.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Fauna & Flora Favoritas com SpecimenAvatar Anti-Falha e Busca Inteligente */}
      <section className="secao-especies-favoritas space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Fish className="w-4 h-4" />
            <span>Fauna & Flora Guardiã ({favoriteSpeciesIds.length} marcadas)</span>
          </div>

          {/* Filtros e Busca */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={speciesSearch}
                onChange={(e) => setSpeciesSearch(e.target.value)}
                placeholder="Buscar animal, planta, bioma..."
                className="pl-8 pr-2.5 py-1.5 text-xs bg-stone-850 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center bg-stone-850 rounded-lg p-0.5 border border-stone-700 text-[11px]">
              {(['all', 'fauna', 'flora', 'threatened'] as const).map((mode) => {
                const labels = { all: 'Todas', fauna: 'Fauna', flora: 'Flora', threatened: 'Ameaçadas' };
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSpeciesFilter(mode)}
                    className={`px-2 py-1 rounded transition font-medium ${
                      speciesFilter === mode
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grade de Espécies com Scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1.5 custom-scrollbar">
          {filteredSpecimens.map((specimen: BiodiversitySpecimen) => {
            const isFav = favoriteSpeciesIds.includes(specimen.id);
            return (
              <button
                key={specimen.id}
                type="button"
                onClick={() => onToggleSpecies(specimen.id)}
                className={`btn-favoritar-especie p-3 rounded-xl border flex items-center gap-3 text-left transition group ${
                  isFav
                    ? 'bg-gradient-to-r from-amber-950/60 to-stone-900 border-amber-500/60 text-amber-100 shadow-sm ring-1 ring-amber-500/20'
                    : 'bg-stone-850/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                }`}
              >
                <SpecimenAvatar
                  specimenId={specimen.id}
                  namePt={specimen.namePt}
                  kingdom={specimen.kingdom}
                  imageUrl={specimen.imageUrl}
                  thumbnailUrl={specimen.thumbnailUrl}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate text-stone-100 group-hover:text-amber-300 transition">
                      {specimen.namePt}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-stone-900 border border-stone-700 text-stone-400 font-mono flex-shrink-0">
                      {specimen.iucnStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 italic truncate mt-0.5">{specimen.scientificName}</div>
                  <div className="text-[9px] text-emerald-400/90 truncate mt-0.5">
                    {specimen.biomes.slice(0, 2).join(' • ')}
                  </div>
                </div>

                {isFav ? (
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                ) : (
                  <Heart className="w-4 h-4 text-stone-600 group-hover:text-stone-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Estados / UFs com Bandeiras Oficiais e Atalhos de Viagem */}
      <section className="secao-estados-favoritos space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Estados e Unidades Federativas ({favoriteStateIds.length} de 27)</span>
          </div>
          <span className="text-[11px] text-stone-400">Clique para favoritar ou viajar</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-14 gap-2 p-3.5 rounded-2xl bg-stone-900/80 border border-stone-700/60">
          {Object.values(BRAZIL_STATES_REGISTRY).map((st: BrazilStateInfo) => {
            const isFav = favoriteStateIds.includes(st.id);
            return (
              <div
                key={st.id}
                className={`relative rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition ${
                  isFav
                    ? 'bg-sky-950/70 border-sky-500/70 text-sky-200 shadow-sm ring-1 ring-sky-500/30'
                    : 'bg-stone-850/60 border-stone-700/50 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <img
                  src={`/flags/${st.id.toLowerCase()}.svg`}
                  alt={st.name}
                  className="w-6 h-4 object-cover rounded shadow-xs border border-stone-600"
                />
                <div className="text-[11px] font-bold text-stone-100">{st.id}</div>
                <button
                  type="button"
                  onClick={() => onToggleState(st.id)}
                  title={isFav ? `Remover ${st.name} dos favoritos` : `Favoritar ${st.name}`}
                  className="p-1 rounded hover:bg-stone-700/80 text-stone-400 transition"
                >
                  {isFav ? (
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ) : (
                    <Heart className="w-3 h-3 text-stone-500" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
