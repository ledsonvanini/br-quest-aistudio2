/**
 * Cliente da API GBIF (Global Biodiversity Information Facility)
 * Acervo científico de espécimes com vouchers e fotos no nó Brasil
 */

import { apiTracker } from '../../apiTracker';
import type { ScientificImageResult } from '../biodiversityTypes';

const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias

export async function queryGBIF(scientificName: string): Promise<ScientificImageResult | null> {
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
            apiTracker.trackCall(
              'gbif-biodiversity',
              `/occurrence?taxonKey=${match.usageKey}&country=BR`,
              dur,
              'success',
              200,
              `Espécime GBIF Brasil: ${match.scientificName}`
            );

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
    // Falha silenciosa
  }

  return null;
}
