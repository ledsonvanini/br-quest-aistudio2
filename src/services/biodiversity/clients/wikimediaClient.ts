/**
 * Cliente da API Wikipedia / Wikimedia Commons
 * Licenças Creative Commons e Domínio Público
 */

import { apiTracker } from '../../apiTracker';
import type { ScientificImageResult } from '../biodiversityTypes';

const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias

export async function queryWikimedia(scientificName: string): Promise<ScientificImageResult | null> {
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
        apiTracker.trackCall(
          'wikipedia-commons',
          `/summary/${wikiSlug}`,
          dur,
          'success',
          200,
          `Artigo Wikipédia pt: ${data.title}`
        );

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
    // Falha silenciosa
  }

  return null;
}
