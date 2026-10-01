/**
 * Rotas de Geolocalização e Geocodificação Reversa
 * Projeto: BR Quest
 */

import { Router } from 'express';
import { resolveStateUfFromName } from '../geo/stateReverseLookup';

export const geoRouter = Router();

geoRouter.get('/api/geolocation/reverse', async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Parâmetros lat e lng inválidos' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SimbolosBR-EduApp/2.0 (contato@simbolosbr.edu.br; ledsonvanini@gmail.com)',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const address = data.address || {};
      const isoCode = address['ISO3166-2-lvl4'] || '';
      let uf = isoCode.replace(/^BR[-_]?/i, '').toUpperCase();

      if (!uf && address.state) {
        const resolved = resolveStateUfFromName(address.state);
        if (resolved) uf = resolved;
      }

      if (uf && uf.length === 2) {
        return res.json({
          stateId: uf,
          stateName: address.state || uf,
          city: address.city || address.town || address.municipality || '',
          source: 'nominatim_server',
        });
      }
    }
  } catch (err: any) {
    console.warn('[GeoRouter] Erro no proxy de geolocalização do servidor:', err.message);
  }

  res.status(404).json({ error: 'Estado não identificado via geocodificação reversa' });
});
