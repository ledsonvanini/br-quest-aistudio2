/**
 * Tipos e Estruturas de Dados do Serviço de Biodiversidade
 */

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

export interface StoredCachePayload {
  [scientificName: string]: ScientificImageResult | { notFound: true; expiresAt: number };
}
