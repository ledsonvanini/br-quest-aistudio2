/**
 * Cliente da API iNaturalist v1
 * Foco em observações Research Grade geolocalizadas no Brasil (place_id=6878)
 */

import { apiTracker } from '../../apiTracker';
import type { ScientificImageResult } from '../biodiversityTypes';

const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias

export async function queryINaturalist(scientificName: string): Promise<ScientificImageResult | null> {
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

        apiTracker.trackCall(
          'inaturalist',
          `/observations?taxon_name=${scientificName}`,
          dur,
          'success',
          200,
          `Foto verificada no Brasil (${obs.place_guess || 'BR'})`
        );

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
        apiTracker.trackCall(
          'inaturalist',
          `/taxa?q=${scientificName}`,
          dur,
          'success',
          200,
          `Táxon iNaturalist encontrado: ${taxon.name}`
        );

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
    // Falha silenciosa
  }

  return null;
}
