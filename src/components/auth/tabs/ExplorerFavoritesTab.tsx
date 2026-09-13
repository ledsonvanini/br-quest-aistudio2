import React, { useState, useMemo } from 'react';
import { BrazilBiome, BiodiversitySpecimen } from '../../../types';
import { BIOME_COLORS, ALL_BRAZIL_SPECIMENS } from '../../../data/brazilBiodiversityData';
import { BRAZIL_STATES_REGISTRY, BrazilStateInfo } from '../../../data/brazilStatesRegistry';
import { TreePine, Fish, MapPin, Heart, Check, Star, Search } from 'lucide-react';

interface ExplorerFavoritesTabProps {
  favoriteBiomes: BrazilBiome[];
  favoriteSpeciesIds: string[];
  favoriteStateIds: string[];
  onToggleBiome: (biome: BrazilBiome) => void;
  onToggleSpecies: (speciesId: string) => void;
  onToggleState: (stateId: string) => void;
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
}) => {
  const [speciesSearch, setSpeciesSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'fauna' | 'flora'>('all');

  const filteredSpecimens = useMemo(() => {
    return ALL_BRAZIL_SPECIMENS.filter((specimen) => {
      const matchesCategory =
        speciesFilter === 'all' || specimen.kingdom.toLowerCase() === speciesFilter;
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
      {/* 1. Biomas Favoritos */}
      <section className="secao-biomas-favoritos space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <TreePine className="w-4 h-4" />
            <span>Biomas de Afinidade ({favoriteBiomes.length}/7)</span>
          </div>
          <span className="text-[11px] text-stone-400">Clique para fixar na navegação rápida</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {AVAILABLE_BIOMES.map((biome) => {
            const isFav = favoriteBiomes.includes(biome);
            const style = BIOME_COLORS[biome];
            return (
              <button
                key={biome}
                type="button"
                onClick={() => onToggleBiome(biome)}
                className={`btn-favoritar-bioma p-3 rounded-xl border text-left flex flex-col justify-between transition h-20 ${
                  isFav
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-md'
                    : 'bg-stone-800/50 border-stone-700/50 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: style?.primary || '#10b981' }}
                  />
                  {isFav ? (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-2">{biome}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Fauna & Flora Favoritas */}
      <section className="secao-especies-favoritas space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Fish className="w-4 h-4" />
            <span>Fauna & Flora Guardiã ({favoriteSpeciesIds.length} selecionadas)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={speciesSearch}
                onChange={(e) => setSpeciesSearch(e.target.value)}
                placeholder="Buscar espécie ou bioma..."
                className="pl-8 pr-2.5 py-1 text-xs bg-stone-800/80 border border-stone-700/60 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 w-44"
              />
            </div>
            <div className="flex items-center bg-stone-800/80 rounded-lg p-0.5 border border-stone-700/60 text-[11px]">
              <button
                type="button"
                onClick={() => setSpeciesFilter('all')}
                className={`px-2 py-0.5 rounded ${speciesFilter === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setSpeciesFilter('fauna')}
                className={`px-2 py-0.5 rounded ${speciesFilter === 'fauna' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Fauna
              </button>
              <button
                type="button"
                onClick={() => setSpeciesFilter('flora')}
                className={`px-2 py-0.5 rounded ${speciesFilter === 'flora' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Flora
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {filteredSpecimens.map((specimen: BiodiversitySpecimen) => {
            const isFav = favoriteSpeciesIds.includes(specimen.id);
            return (
              <button
                key={specimen.id}
                type="button"
                onClick={() => onToggleSpecies(specimen.id)}
                className={`btn-favoritar-especie p-2.5 rounded-xl border flex items-center gap-3 text-left transition ${
                  isFav
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-100 shadow-sm'
                    : 'bg-stone-800/40 border-stone-700/50 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <img
                  src={specimen.thumbnailUrl || specimen.imageUrl}
                  alt={specimen.namePt}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-stone-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate text-stone-200">{specimen.namePt}</div>
                  <div className="text-[10px] text-stone-400 italic truncate">{specimen.scientificName}</div>
                </div>
                {isFav ? (
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                ) : (
                  <Heart className="w-4 h-4 text-stone-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Estados / UFs de Predileção */}
      <section className="secao-estados-favoritos space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>UFs Prediletas ({favoriteStateIds.length}/27)</span>
          </div>
          <span className="text-[11px] text-stone-400">Atalhos territoriais imediatos</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-14 gap-1.5 p-3 rounded-xl bg-stone-900/60 border border-stone-800">
          {Object.values(BRAZIL_STATES_REGISTRY).map((st: BrazilStateInfo) => {
            const isFav = favoriteStateIds.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onToggleState(st.id)}
                title={`${st.name} (${st.capital})`}
                className={`btn-tag-estado py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
                  isFav
                    ? 'bg-sky-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                }`}
              >
                <span>{st.id}</span>
                {isFav && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
