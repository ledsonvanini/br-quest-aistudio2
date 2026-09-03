// ============================================================================
// SERVIÇO DE HINOS HISTÓRICOS & DADOS ABERTOS OFICIAIS DO BRASIL
// Fornece letras integrais, metadados de autoria, leis de oficialização,
// termos raros e integração com portais oficiais (.gov.br) e enciclopédicos abertos.
// ============================================================================

import {
  OFFICIAL_FULL_ANTHEMS,
  OFFICIAL_NATIONAL_ANTHEMS,
  OfficialAnthemDetail,
  getOfficialAnthemDetails,
} from '../data/officialFullAnthemsData';

export interface ExternalAnthemMetadata {
  title: string;
  extract?: string;
  description?: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
}

class AnthemsService {
  private cache = new Map<string, ExternalAnthemMetadata>();

  /**
   * Retorna os dados oficiais e letra integral local (100% confiável, imediato e offline).
   */
  public getLocalOfficialAnthem(stateIdOrAnthemId: string): OfficialAnthemDetail | null {
    return getOfficialAnthemDetails(stateIdOrAnthemId);
  }

  /**
   * Retorna todos os hinos cadastrados com letra integral (27 estados + símbolos nacionais).
   */
  public getAllOfficialAnthems(): OfficialAnthemDetail[] {
    return [
      ...Object.values(OFFICIAL_FULL_ANTHEMS),
      ...Object.values(OFFICIAL_NATIONAL_ANTHEMS),
    ];
  }

  /**
   * Busca complementar aberta via Wikimedia / Wikisource API pública (sem necessidade de chave de API).
   * Complementa dados históricos com resumos enciclopédicos e artigos públicos.
   */
  public async fetchOpenDataMetadata(stateNameOrTitle: string): Promise<ExternalAnthemMetadata | null> {
    const key = stateNameOrTitle.toLowerCase().trim();
    if (this.cache.has(key)) {
      return this.cache.get(key) || null;
    }

    try {
      // Normalização do termo de busca
      const pageTitle = encodeURIComponent(`Hino_do_${stateNameOrTitle.replace(/\s+/g, '_')}`);
      const res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        // Fallback: tentar busca genérica com Hino_de_
        const altPageTitle = encodeURIComponent(`Hino_de_${stateNameOrTitle.replace(/\s+/g, '_')}`);
        const altRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${altPageTitle}`);
        if (!altRes.ok) return null;
        const altData = await altRes.json();
        const meta: ExternalAnthemMetadata = {
          title: altData.title || stateNameOrTitle,
          extract: altData.extract,
          description: altData.description,
          sourceUrl: altData.content_urls?.desktop?.page,
          thumbnailUrl: altData.thumbnail?.source,
        };
        this.cache.set(key, meta);
        return meta;
      }

      const data = await res.json();
      const meta: ExternalAnthemMetadata = {
        title: data.title || stateNameOrTitle,
        extract: data.extract,
        description: data.description,
        sourceUrl: data.content_urls?.desktop?.page,
        thumbnailUrl: data.thumbnail?.source,
      };
      this.cache.set(key, meta);
      return meta;
    } catch {
      // Resiliente a falhas de rede / offline
      return null;
    }
  }
}

export const anthemsService = new AnthemsService();
