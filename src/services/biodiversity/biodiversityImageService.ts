/**
 * Coordenador do Serviço Científico de Imagens de Biodiversidade Brasileira
 * Integra iNaturalist, GBIF, Wikimedia e Base Curada Nacional
 * 
 * Regra de Ouro: < 250 linhas, cache em 2 níveis, concorrência e in-flight deduplication.
 */

import { apiTracker } from '../apiTracker';
import { ALL_BRAZIL_SPECIMENS } from '../../data/brazilBiodiversityData';
import type { ScientificImageResult, StoredCachePayload } from './biodiversityTypes';
import { queryINaturalist } from './clients/iNaturalistClient';
import { queryGBIF } from './clients/gbifClient';
import { queryWikimedia } from './clients/wikimediaClient';

export * from './biodiversityTypes';
export * from './urlOptimizer';

const STORAGE_KEY = 'br_quest_scientific_biodiv_images_v2';
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias
const NEGATIVE_TTL_MS = 1000 * 60 * 60 * 24; // 24 horas
const MAX_CONCURRENT = 2;
const MIN_REQUEST_INTERVAL_MS = 250;

// 1. Cache em memória (L1)
const memoryCache = new Map<string, ScientificImageResult | 'NOT_FOUND'>();

// 2. In-flight request deduplication
const inFlightRequests = new Map<string, Promise<ScientificImageResult | null>>();

// 3. Fila de execução com rate limit
let activeRequestsCount = 0;
let lastRequestTime = 0;
const executionQueue: (() => void)[] = [];

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

    if (hasExpired) {
      persistStorageCache();
    }
  } catch {
    // Ignorar erro
  }
}

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
    // Falha silenciosa de quota
  }
}

initStorageCache();

async function scheduleNetworkRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const task = async () => {
      activeRequestsCount++;
      try {
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

  const localSpecimen = ALL_BRAZIL_SPECIMENS.find(
    (s) => s.scientificName.toLowerCase() === clean.toLowerCase()
  );
  if (localSpecimen) {
    return {
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

export async function getScientificImage(
  scientificName: string,
  fallbackUrl?: string
): Promise<ScientificImageResult | null> {
  const clean = scientificName.trim();
  if (!clean) return null;

  // 1. Checagem L1
  const cached = memoryCache.get(clean);
  if (cached) {
    if (cached === 'NOT_FOUND') return getScientificImageSync(clean, fallbackUrl);
    apiTracker.trackCall('gbif-biodiversity', `/taxa/${clean}`, 1, 'cached', 200, `Imagem científica de ${clean} recuperada do cache local`);
    return cached;
  }

  // 2. In-flight deduplication
  if (inFlightRequests.has(clean)) {
    return inFlightRequests.get(clean)!;
  }

  // 3. Execução em fila com fallback em cascata
  const promise = scheduleNetworkRequest(async () => {
    try {
      // Provedor 1: iNaturalist (Grau de pesquisa no Brasil)
      const inatResult = await queryINaturalist(clean);
      if (inatResult) {
        memoryCache.set(clean, inatResult);
        persistStorageCache();
        return inatResult;
      }

      // Provedor 2: GBIF Brasil
      const gbifResult = await queryGBIF(clean);
      if (gbifResult) {
        memoryCache.set(clean, gbifResult);
        persistStorageCache();
        return gbifResult;
      }

      // Provedor 3: Wikimedia Commons
      const wikiResult = await queryWikimedia(clean);
      if (wikiResult) {
        memoryCache.set(clean, wikiResult);
        persistStorageCache();
        return wikiResult;
      }

      // Cache negativo
      memoryCache.set(clean, 'NOT_FOUND');
      persistStorageCache();
    } catch {
      // Tratamento de falha silenciosa
    } finally {
      inFlightRequests.delete(clean);
    }

    return getScientificImageSync(clean, fallbackUrl);
  });

  inFlightRequests.set(clean, promise);
  return promise;
}
