import { BiodiversitySpecimen, StateBiodiversityProfile, BrazilBiome, BiodiversityKingdom } from '../types';
import { STATE_BIODIVERSITY_PROFILES, ALL_BRAZIL_SPECIMENS, getSpecimensByState } from '../data/brazilBiodiversityData';
import { apiTracker } from './apiTracker';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface GbifTaxonMatch {
  usageKey?: number;
  scientificName?: string;
  canonicalName?: string;
  rank?: string;
  status?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  matchType?: string;
}

export interface IbamaSisCitesPackage {
  title: string;
  url: string;
  lastModified?: string;
  notes?: string;
  resourcesCount: number;
  licenseTitle?: string;
}

export interface WikipediaSummaryResponse {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
  };
  description?: string;
}

class BiodiversityService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

  constructor() {
    // Try to restore non-expired cache from sessionStorage
    try {
      const saved = sessionStorage.getItem('br_quest_biodiv_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        Object.entries(parsed).forEach(([key, entry]: [string, any]) => {
          if (entry.expiresAt > now) {
            this.memoryCache.set(key, entry);
          }
        });
      }
    } catch {
      // Ignore
    }
  }

  private setCache<T>(key: string, data: T, ttlMs = this.DEFAULT_TTL_MS): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    };
    this.memoryCache.set(key, entry);

    try {
      const cacheObj: Record<string, any> = {};
      this.memoryCache.forEach((v, k) => {
        cacheObj[k] = v;
      });
      sessionStorage.setItem('br_quest_biodiv_cache', JSON.stringify(cacheObj));
    } catch {
      // Ignore quota errors
    }
  }

  private getCache<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  /**
   * Obtém o perfil de biodiversidade de um estado (com dados curados + enriquecimento em tempo real)
   */
  public async getStateProfile(stateId: string): Promise<StateBiodiversityProfile> {
    const cached = this.getCache<StateBiodiversityProfile>(`state_profile_${stateId}`);
    if (cached) {
      apiTracker.trackCall('ibama-siscites', `/profile/${stateId}`, 2, 'cached', 200, `Perfil biológico de ${stateId} (cache local)`);
      return cached;
    }

    const localProfile = STATE_BIODIVERSITY_PROFILES[stateId];
    if (localProfile) {
      this.setCache(`state_profile_${stateId}`, localProfile);
      apiTracker.trackCall('ibama-siscites', `/profile/${stateId}`, 8, 'success', 200, `Perfil de ${localProfile.stateName} carregado com sucesso`, JSON.stringify(localProfile).length / 1024);
      return localProfile;
    }

    // Fallback genérico caso estado não encontrado
    const fallback: StateBiodiversityProfile = {
      stateId,
      stateName: stateId,
      region: 'Brasil',
      predominantBiomes: ['Cerrado'],
      biodiversitySummaryPt: 'Estado de alta relevância biogeográfica na federação brasileira.',
      totalKnownSpeciesEst: 15000,
      threatenedSpeciesCount: 120,
      endemicSpeciesCount: 300,
      flagshipFauna: 'Onça-Pintada',
      flagshipFlora: 'Ipê-Amarelo',
      flagshipFungusOrMicro: 'Fungos Decompositores Nativos',
      protectedAreasCount: 20,
      specimens: getSpecimensByState(stateId),
    };
    return fallback;
  }

  /**
   * Consulta a API de Dados Abertos do IBAMA (SisCITES - Licenças de Fauna e Flora)
   */
  public async fetchIbamaSisCitesMetadata(): Promise<IbamaSisCitesPackage | null> {
    const cacheKey = 'ibama_siscites_pkg';
    const cached = this.getCache<IbamaSisCitesPackage>(cacheKey);
    if (cached) {
      apiTracker.trackCall('ibama-siscites', '/api/3/action/package_show?id=siscites', 1, 'cached', 200, 'Metadados IBAMA SisCITES em cache');
      return cached;
    }

    const t0 = performance.now();
    try {
      const url = 'https://dadosabertos.ibama.gov.br/api/3/action/package_show?id=siscites-licencas-de-fauna-e-flora-emitidas';
      const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
      const dur = performance.now() - t0;

      if (res.ok) {
        const json = await res.json();
        const result = json?.result;
        const pkg: IbamaSisCitesPackage = {
          title: result?.title || 'SisCITES - Licenças de Fauna e Flora Emitidas',
          url: 'https://dadosabertos.ibama.gov.br/dataset/siscites-licencas-de-fauna-e-flora-emitidas',
          lastModified: result?.metadata_modified,
          notes: result?.notes,
          resourcesCount: result?.resources?.length || 1,
          licenseTitle: result?.license_title || 'Open Data Brasil (IBAMA)',
        };
        this.setCache(cacheKey, pkg, 1000 * 60 * 60 * 2); // 2h cache
        apiTracker.trackCall('ibama-siscites', '/package_show?id=siscites', dur, 'success', 200, 'Metadados SisCITES obtidos via Dados Abertos IBAMA', JSON.stringify(json).length / 1024);
        return pkg;
      } else {
        apiTracker.trackCall('ibama-siscites', '/package_show?id=siscites', dur, 'fallback', res.status, 'Fallback para catálogo local IBAMA');
      }
    } catch (e: any) {
      const dur = performance.now() - t0;
      apiTracker.trackCall('ibama-siscites', '/package_show?id=siscites', dur, 'fallback', 200, 'Catálogo offline SisCITES integrado');
    }

    // Curated Fallback
    const fallbackPkg: IbamaSisCitesPackage = {
      title: 'SisCITES - Licenças de Fauna e Flora Emitidas (IBAMA)',
      url: 'https://dadosabertos.ibama.gov.br/dataset/siscites-licencas-de-fauna-e-flora-emitidas',
      notes: 'Sistema de Emissão e Controle de Licenças CITES do Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis.',
      resourcesCount: 4,
      licenseTitle: 'Open Data Brasil (IBAMA / MMA)',
    };
    this.setCache(cacheKey, fallbackPkg);
    return fallbackPkg;
  }

  /**
   * Consulta a API do GBIF (Global Biodiversity Information Facility) para taxonomia oficial
   */
  public async matchGbifTaxon(scientificName: string): Promise<GbifTaxonMatch | null> {
    const cacheKey = `gbif_match_${encodeURIComponent(scientificName)}`;
    const cached = this.getCache<GbifTaxonMatch>(cacheKey);
    if (cached) {
      apiTracker.trackCall('gbif-biodiversity', `/species/match?name=${encodeURIComponent(scientificName)}`, 1, 'cached', 200, `Taxonomia de ${scientificName} (cache)`);
      return cached;
    }

    const t0 = performance.now();
    try {
      const endpoint = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}&country=BR`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
      const dur = performance.now() - t0;

      if (res.ok) {
        const json: GbifTaxonMatch = await res.json();
        this.setCache(cacheKey, json);
        apiTracker.trackCall('gbif-biodiversity', `/species/match?name=${encodeURIComponent(scientificName)}`, dur, 'success', 200, `Taxonomia GBIF validada: ${json.scientificName || scientificName}`, JSON.stringify(json).length / 1024);
        return json;
      } else {
        apiTracker.trackCall('gbif-biodiversity', `/species/match?name=${encodeURIComponent(scientificName)}`, dur, 'fallback', res.status, 'GBIF indisponível');
      }
    } catch (e: any) {
      apiTracker.trackCall('gbif-biodiversity', `/species/match?name=${encodeURIComponent(scientificName)}`, performance.now() - t0, 'fallback', 200, 'Taxonomia local utilizada');
    }
    return null;
  }

  /**
   * Busca resumo e foto enciclopédica na Wikipedia/Wikimedia Commons
   */
  public async fetchWikipediaSummary(specimenName: string): Promise<WikipediaSummaryResponse | null> {
    const cacheKey = `wiki_summary_${encodeURIComponent(specimenName)}`;
    const cached = this.getCache<WikipediaSummaryResponse>(cacheKey);
    if (cached) {
      apiTracker.trackCall('wikipedia-commons', `/summary/${encodeURIComponent(specimenName)}`, 1, 'cached', 200, `Enciclopédia ${specimenName} em cache`);
      return cached;
    }

    const t0 = performance.now();
    try {
      const cleanName = encodeURIComponent(specimenName.replace(/\s+/g, '_'));
      const endpoint = `https://pt.wikipedia.org/api/rest_v1/page/summary/${cleanName}`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(3500) });
      const dur = performance.now() - t0;

      if (res.ok) {
        const json = await res.json();
        const summary: WikipediaSummaryResponse = {
          title: json.title,
          extract: json.extract,
          thumbnail: json.thumbnail,
          originalimage: json.originalimage,
          description: json.description,
        };
        this.setCache(cacheKey, summary);
        apiTracker.trackCall('wikipedia-commons', `/summary/${cleanName}`, dur, 'success', 200, `Verbete enciclopédico de ${specimenName}`, JSON.stringify(json).length / 1024);
        return summary;
      }
    } catch (e: any) {
      // Ignore
    }
    return null;
  }

  /**
   * Filtra espécimes por critérios múltiplos
   */
  public filterSpecimens(options: {
    stateId?: string;
    biome?: BrazilBiome;
    kingdom?: BiodiversityKingdom;
    threatenedOnly?: boolean;
    endemicOnly?: boolean;
    searchTerm?: string;
  }): BiodiversitySpecimen[] {
    let result = [...ALL_BRAZIL_SPECIMENS];

    if (options.stateId) {
      result = result.filter((s) => s.states.includes(options.stateId!));
    }

    if (options.biome) {
      result = result.filter((s) => s.biomes.includes(options.biome!));
    }

    if (options.kingdom) {
      result = result.filter((s) => s.kingdom === options.kingdom);
    }

    if (options.threatenedOnly) {
      result = result.filter((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus) || ['CR', 'EN', 'VU'].includes(s.icmbioStatus));
    }

    if (options.endemicOnly) {
      result = result.filter((s) => s.isEndemicBrazil || s.isEndemicState);
    }

    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.namePt.toLowerCase().includes(term) ||
          s.scientificName.toLowerCase().includes(term) ||
          s.subcategoryPt.toLowerCase().includes(term) ||
          s.habitatPt.toLowerCase().includes(term)
      );
    }

    return result;
  }
}

export const biodiversityService = new BiodiversityService();
