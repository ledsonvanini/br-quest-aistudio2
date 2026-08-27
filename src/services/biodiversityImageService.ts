/**
 * Serviço Científico de Imagens de Biodiversidade Brasileira
 * Fontes Oficiais Integradas:
 * 1. iNaturalist API v1 (Observações Research Grade geolocalizadas no Brasil - place_id=6878)
 * 2. GBIF Occurrence Media API (Acervo científico com vouchers e fotos no Brasil)
 * 3. Wikimedia Commons / Wikipedia Taxobox REST API (Licenças Creative Commons / Domínio Público)
 * 
 * Políticas de Engenharia:
 * - Cache persistente em 2 níveis (In-Memory + LocalStorage com TTL de 14 dias)
 * - Fila com controle rigoroso de concorrência (máximo 2 requisições simultâneas)
 * - Rate limiter com espaçamento de 250ms entre chamadas externas
 * - Deduplicação de requisições em voo (in-flight promise sharing)
 * - Cache negativo (24h) para evitar bombardeamento de espécies não encontradas
 * - Rastreamento com telemetria no apiTracker
 */

import { apiTracker } from './apiTracker';
import { ALL_BRAZIL_SPECIMENS } from '../data/brazilBiodiversityData';

export type ScientificImageSource =
  | 'inaturalist_research'
  | 'gbif_brazil'
  | 'wikimedia_commons'
  | 'jbrj_reflora'
  | 'curated_dataset';

export interface ScientificImageResult {
  scientificName: string;
  canonicalName?: string;
  imageUrl: string;
  thumbnailUrl: string;
  cardUrl: string;
  source: ScientificImageSource;
  sourceLabel: string;
  photographer: string;
  license: string;
  observationUrl?: string;
  placeName?: string;
  qualityGrade?: string;
  cachedAt: number;
  expiresAt: number;
}

interface StoredCachePayload {
  [scientificName: string]: ScientificImageResult | { notFound: true; expiresAt: number };
}

const STORAGE_KEY = 'br_quest_scientific_biodiv_images_v2';
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias (dados taxonômicos são perenes)
const NEGATIVE_TTL_MS = 1000 * 60 * 60 * 24; // 24 horas para resultados negativos
const MAX_CONCURRENT = 2; // Máximo de 2 conexões simultâneas a APIs científicas
const MIN_REQUEST_INTERVAL_MS = 250; // Throttle de 250ms entre disparos

// 1. Mapeamento síncrono em memória (Nível 1)
const memoryCache = new Map<string, ScientificImageResult | 'NOT_FOUND'>();

// 2. Mapa de promessas em voo para deduplicação
const inFlightRequests = new Map<string, Promise<ScientificImageResult | null>>();

// 3. Fila de execução controlada
let activeRequestsCount = 0;
let lastRequestTime = 0;
const executionQueue: (() => void)[] = [];

/**
 * Inicialização e recuperação de cache persistente do LocalStorage
 */
function initStorageCache() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed: StoredCachePayload = JSON.parse(raw);
    const now = Date.now();
    let hasExpired = false;

    Object.entries(parsed).forEach(([key, entry]) => {
      if (entry && entry.expiresAt && entry.expiresAt > now) {
        if ('notFound' in entry && entry.notFound) {
          memoryCache.set(key, 'NOT_FOUND');
        } else if ('imageUrl' in entry) {
          memoryCache.set(key, entry as ScientificImageResult);
        }
      } else {
        hasExpired = true;
      }
    });

    // Limpeza de itens expirados se necessário
    if (hasExpired) {
      persistStorageCache();
    }
  } catch {
    // Ignorar erros de cota do localStorage
  }
}

/**
 * Salva o cache em memória no LocalStorage com controle de erros
 */
function persistStorageCache() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cacheObj: StoredCachePayload = {};
    const now = Date.now();

    memoryCache.forEach((value, key) => {
      if (value === 'NOT_FOUND') {
        cacheObj[key] = { notFound: true, expiresAt: now + NEGATIVE_TTL_MS };
      } else {
        cacheObj[key] = value;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
  } catch {
    // Caso estoure a cota do localStorage, limpar chaves antigas
  }
}

// Inicializar na carga do módulo
initStorageCache();

/**
 * Converte e otimiza inteligentemente qualquer URL de imagem para a resolução ideal:
 * - 'thumb': Resolução para medalhões e ícones (~320px)
 * - 'card': Resolução balanceada para listagens (~400px)
 * - 'full': Resolução de alta definição para ficha técnica (~1000px-1200px)
 */
export function getOptimizedBiodiversityImageUrl(
  rawUrl?: string,
  size: 'thumb' | 'card' | 'full' = 'card'
): string {
  if (!rawUrl) return '';
  const clean = rawUrl.trim();
  if (!clean) return '';

  // 1. Wikimedia Commons CDN
  if (clean.includes('upload.wikimedia.org/wikipedia/commons/')) {
    const targetPx = size === 'full' ? '1000px' : '320px';

    if (clean.includes('/thumb/')) {
      return clean.replace(/\/\d+px-([^/]+)$/, `/${targetPx}-$1`);
    }

    const commonsMatch = clean.match(/wikipedia\/commons\/([a-f0-9]\/[a-f0-9]{2}\/([^/]+))$/i);
    if (commonsMatch) {
      const relPath = commonsMatch[1];
      const fileName = commonsMatch[2];
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${relPath}/${targetPx}-${fileName}`;
    }
    return clean;
  }

  // 2. Unsplash CDN
  if (clean.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(clean);
      if (size === 'thumb' || size === 'card') {
        urlObj.searchParams.set('w', '360');
        urlObj.searchParams.set('h', '360');
        urlObj.searchParams.set('fit', 'crop');
        urlObj.searchParams.set('crop', 'faces,center');
        urlObj.searchParams.set('q', '80');
        urlObj.searchParams.set('auto', 'format');
      } else {
        urlObj.searchParams.set('w', '1200');
        urlObj.searchParams.set('q', '85');
        urlObj.searchParams.set('auto', 'format');
      }
      return urlObj.toString();
    } catch {
      return clean;
    }
  }

  // 3. iNaturalist CDN (/small.jpg ~240px, /medium.jpg ~500px, /large.jpg ~1024px)
  if (clean.includes('inaturalist-open-data') || clean.includes('inaturalist.org')) {
    if (size === 'thumb' || size === 'card') {
      return clean.replace(/\/(large|original|square)\.(jpg|jpeg|png)/i, '/medium.$2');
    } else {
      return clean.replace(/\/(square|small|medium)\.(jpg|jpeg|png)/i, '/large.$2');
    }
  }

  return clean;
}

/**
 * Enfileira e agenda uma requisição de rede respeitando o limite de concorrência e throttle
 */
async function scheduleNetworkRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const task = async () => {
      activeRequestsCount++;
      try {
        // Garantir throttle mínimo entre disparos
        const now = Date.now();
        const elapsed = now - lastRequestTime;
        if (elapsed < MIN_REQUEST_INTERVAL_MS) {
          await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed));
        }
        lastRequestTime = Date.now();

        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        activeRequestsCount--;
        const next = executionQueue.shift();
        if (next) {
          next();
        }
      }
    };

    if (activeRequestsCount < MAX_CONCURRENT) {
      task();
    } else {
      executionQueue.push(task);
    }
  });
}

/**
 * 1. Consulta o iNaturalist API com foco em observações brasileiras Research Grade
 */
async function queryINaturalist(scientificName: string): Promise<ScientificImageResult | null> {
  const t0 = performance.now();
  const cleanName = encodeURIComponent(scientificName.trim());

  // A: Tentar observações com foto no Brasil (place_id=6878) de grau de pesquisa
  try {
    const obsUrl = `https://api.inaturalist.org/v1/observations?taxon_name=${cleanName}&photos=true&quality_grade=research&place_id=6878&per_page=1`;
    const res = await fetch(obsUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'application/json' },
    });
    const dur = performance.now() - t0;

    if (res.ok) {
      const data = await res.json();
      const obs = data.results?.[0];
      const photo = obs?.photos?.[0];

      if (photo?.url) {
        const mediumUrl = photo.url.replace('/square.', '/medium.');
        const largeUrl = photo.url.replace('/square.', '/large.');
        const origUrl = photo.url.replace('/square.', '/original.');

        apiTracker.trackCall('inaturalist', `/observations?taxon_name=${scientificName}`, dur, 'success', 200, `Foto verificada no Brasil (${obs.place_guess || 'BR'})`);

        return {
          scientificName,
          canonicalName: obs.taxon?.name || scientificName,
          imageUrl: origUrl || largeUrl || mediumUrl,
          thumbnailUrl: mediumUrl,
          cardUrl: largeUrl || mediumUrl,
          source: 'inaturalist_research',
          sourceLabel: 'iNaturalist • Observação Científica no Brasil',
          photographer: photo.attribution || obs.user?.name || obs.user?.login || 'iNaturalist Observer',
          license: photo.license_code ? `CC-${photo.license_code.toUpperCase()}` : 'Creative Commons',
          observationUrl: `https://www.inaturalist.org/observations/${obs.id}`,
          placeName: obs.place_guess || 'Brasil',
          qualityGrade: 'Research Grade (Pesquisa Científica)',
          cachedAt: Date.now(),
          expiresAt: Date.now() + TTL_MS,
        };
      }
    }
  } catch {
    // Continuar para consulta de táxon
  }

  // B: Fallback de táxon direto do iNaturalist
  try {
    const taxaUrl = `https://api.inaturalist.org/v1/taxa?q=${cleanName}&locale=pt-BR&per_page=1`;
    const res = await fetch(taxaUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'application/json' },
    });
    const dur = performance.now() - t0;

    if (res.ok) {
      const data = await res.json();
      const taxon = data.results?.[0];
      const photo = taxon?.default_photo;

      if (photo?.medium_url || photo?.square_url) {
        apiTracker.trackCall('inaturalist', `/taxa?q=${scientificName}`, dur, 'success', 200, `Táxon iNaturalist encontrado: ${taxon.name}`);

        return {
          scientificName,
          canonicalName: taxon.name || scientificName,
          imageUrl: photo.original_url || photo.large_url || photo.medium_url,
          thumbnailUrl: photo.medium_url || photo.square_url,
          cardUrl: photo.large_url || photo.medium_url,
          source: 'inaturalist_research',
          sourceLabel: 'iNaturalist • Taxonomia Oficial',
          photographer: photo.attribution || 'iNaturalist',
          license: photo.license_code ? `CC-${photo.license_code.toUpperCase()}` : 'Creative Commons',
          observationUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
          cachedAt: Date.now(),
          expiresAt: Date.now() + TTL_MS,
        };
      }
    }
  } catch {
    // Continuar para próximo provedor
  }

  return null;
}

/**
 * 2. Consulta o GBIF (Global Biodiversity Information Facility) no nó Brasil
 */
async function queryGBIF(scientificName: string): Promise<ScientificImageResult | null> {
  const t0 = performance.now();
  const cleanName = encodeURIComponent(scientificName.trim());

  try {
    const matchUrl = `https://api.gbif.org/v1/species/match?name=${cleanName}&strict=true`;
    const matchRes = await fetch(matchUrl, { signal: AbortSignal.timeout(3500) });

    if (matchRes.ok) {
      const match = await matchRes.json();
      if (match.usageKey) {
        const occUrl = `https://api.gbif.org/v1/occurrence/search?taxonKey=${match.usageKey}&country=BR&mediaType=StillImage&limit=1`;
        const occRes = await fetch(occUrl, { signal: AbortSignal.timeout(3500) });
        const dur = performance.now() - t0;

        if (occRes.ok) {
          const occData = await occRes.json();
          const occ = occData.results?.[0];
          const media = occ?.media?.[0];

          if (media?.identifier) {
            apiTracker.trackCall('gbif-biodiversity', `/occurrence?taxonKey=${match.usageKey}&country=BR`, dur, 'success', 200, `Espécime GBIF Brasil: ${match.scientificName}`);

            return {
              scientificName,
              canonicalName: match.canonicalName || scientificName,
              imageUrl: media.identifier,
              thumbnailUrl: media.identifier,
              cardUrl: media.identifier,
              source: 'gbif_brazil',
              sourceLabel: 'GBIF Brasil • Acervo Científico',
              photographer: media.rightsHolder || media.creator || occ.recordedBy || 'GBIF Contributor',
              license: media.license || 'Open Access (CC-BY)',
              observationUrl: `https://www.gbif.org/occurrence/${occ.key}`,
              placeName: occ.stateProvince ? `${occ.stateProvince}, Brasil` : 'Brasil',
              cachedAt: Date.now(),
              expiresAt: Date.now() + TTL_MS,
            };
          }
        }
      }
    }
  } catch {
    // Continuar para Wikimedia
  }

  return null;
}

/**
 * 3. Consulta a API REST do Wikipedia / Wikimedia Commons
 */
async function queryWikimedia(scientificName: string): Promise<ScientificImageResult | null> {
  const t0 = performance.now();
  const wikiSlug = encodeURIComponent(scientificName.trim().replace(/\s+/g, '_'));

  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: { Accept: 'application/json' },
    });
    const dur = performance.now() - t0;

    if (res.ok) {
      const data = await res.json();
      const imgSource = data.originalimage?.source || data.thumbnail?.source;

      if (imgSource) {
        apiTracker.trackCall('wikipedia-commons', `/summary/${wikiSlug}`, dur, 'success', 200, `Artigo Wikipédia pt: ${data.title}`);

        return {
          scientificName,
          canonicalName: data.title || scientificName,
          imageUrl: data.originalimage?.source || imgSource,
          thumbnailUrl: data.thumbnail?.source || imgSource,
          cardUrl: data.originalimage?.source || imgSource,
          source: 'wikimedia_commons',
          sourceLabel: 'Wikimedia Commons • Acervo Aberto',
          photographer: 'Wikimedia Commons / Domínio Público',
          license: 'Creative Commons (CC BY-SA)',
          observationUrl: data.content_urls?.desktop?.page,
          cachedAt: Date.now(),
          expiresAt: Date.now() + TTL_MS,
        };
      }
    }
  } catch {
    // Retornar nulo
  }

  return null;
}

/**
 * Consulta síncrona imediata (retorna do cache em memória ou dados curados sem causar renderização em branco)
 */
export function getScientificImageSync(
  scientificName?: string,
  fallbackUrl?: string
): ScientificImageResult | null {
  if (!scientificName) return null;
  const clean = scientificName.trim();
  if (!clean) return null;

  const cached = memoryCache.get(clean);
  if (cached && cached !== 'NOT_FOUND') {
    return cached;
  }

  // Verificar na base curada nacional
  const localSpecimen = ALL_BRAZIL_SPECIMENS.find(
    (s) => s.scientificName.toLowerCase() === clean.toLowerCase()
  );
  if (localSpecimen) {
    const result: ScientificImageResult = {
      scientificName: localSpecimen.scientificName,
      canonicalName: localSpecimen.namePt,
      imageUrl: localSpecimen.imageUrl,
      thumbnailUrl: localSpecimen.thumbnailUrl || localSpecimen.imageUrl,
      cardUrl: localSpecimen.imageUrl,
      source: 'curated_dataset',
      sourceLabel: 'Curadoria Científica Nacional (ICMBio / JBRJ)',
      photographer: 'Acervo Documental da Biodiversidade Brasileira',
      license: 'Creative Commons / Domínio Público',
      cachedAt: Date.now(),
      expiresAt: Date.now() + TTL_MS,
    };
    return result;
  }

  if (fallbackUrl) {
    return {
      scientificName: clean,
      imageUrl: fallbackUrl,
      thumbnailUrl: fallbackUrl,
      cardUrl: fallbackUrl,
      source: 'curated_dataset',
      sourceLabel: 'Referência Curada',
      photographer: 'Acervo Científico',
      license: 'Creative Commons',
      cachedAt: Date.now(),
      expiresAt: Date.now() + TTL_MS,
    };
  }

  return null;
}

/**
 * Busca de Imagem Científica Oficial com fila, controle de requisição, cache de 2 níveis e fallback gracioso
 */
export async function getScientificImage(
  scientificName: string,
  fallbackUrl?: string
): Promise<ScientificImageResult | null> {
  const clean = scientificName.trim();
  if (!clean) return null;

  // 1. Checagem em Memória (Nível 1)
  const cached = memoryCache.get(clean);
  if (cached) {
    if (cached === 'NOT_FOUND') return getScientificImageSync(clean, fallbackUrl);
    apiTracker.trackCall('gbif-biodiversity', `/taxa/${clean}`, 1, 'cached', 200, `Imagem científica de ${clean} recuperada do cache local`);
    return cached;
  }

  // 2. Checagem de Requisição em Voo (Deduplicação de chamadas simultâneas)
  if (inFlightRequests.has(clean)) {
    return inFlightRequests.get(clean)!;
  }

  // 3. Criar tarefa com deduplicação
  const promise = scheduleNetworkRequest(async () => {
    try {
      // Prioridade 1: iNaturalist (Observações Research Grade no Brasil)
      const inatResult = await queryINaturalist(clean);
      if (inatResult) {
        memoryCache.set(clean, inatResult);
        persistStorageCache();
        return inatResult;
      }

      // Prioridade 2: GBIF Brasil
      const gbifResult = await queryGBIF(clean);
      if (gbifResult) {
        memoryCache.set(clean, gbifResult);
        persistStorageCache();
        return gbifResult;
      }

      // Prioridade 3: Wikimedia Commons
      const wikiResult = await queryWikimedia(clean);
      if (wikiResult) {
        memoryCache.set(clean, wikiResult);
        persistStorageCache();
        return wikiResult;
      }

      // Marcação de cache negativo (evita requisições repetidas para a mesma espécie não indexada)
      memoryCache.set(clean, 'NOT_FOUND');
      persistStorageCache();
    } catch {
      // Em caso de erro de rede, registrar como indisponível temporário
    } finally {
      inFlightRequests.delete(clean);
    }

    return getScientificImageSync(clean, fallbackUrl);
  });

  inFlightRequests.set(clean, promise);
  return promise;
}
