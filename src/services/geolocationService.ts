// Serviço de Geolocalização com Alta Precisão,
// Reverse Geocoding via Nominatim/BigDataCloud, Verificação Poligonal GeoJSON Exata (IBGE)
// e Fallback por IP para garantir funcionamento em iframes e navegadores restritos.

import { getCachedGeoData, loadBrazilGeoData } from '../lib/geoDataLoader';

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  detectedStateId: string;
  stateName: string;
  regionId: string;
  source: 'gps' | 'reverse_geocoding' | 'polygon' | 'ip';
}

// Mapeamento normalizado de nomes de estados e códigos para UF
export const STATE_NAME_TO_UF: Record<string, string> = {
  'acre': 'AC',
  'alagoas': 'AL',
  'amapa': 'AP',
  'amapá': 'AP',
  'amazonas': 'AM',
  'bahia': 'BA',
  'ceara': 'CE',
  'ceará': 'CE',
  'distrito federal': 'DF',
  'brasilia': 'DF',
  'brasília': 'DF',
  'espirito santo': 'ES',
  'espírito santo': 'ES',
  'goias': 'GO',
  'goiás': 'GO',
  'maranhao': 'MA',
  'maranhão': 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  'para': 'PA',
  'pará': 'PA',
  'paraiba': 'PB',
  'paraíba': 'PB',
  'parana': 'PR',
  'paraná': 'PR',
  'pernambuco': 'PE',
  'piaui': 'PI',
  'piauí': 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  'rondonia': 'RO',
  'rondônia': 'RO',
  'roraima': 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  'são paulo': 'SP',
  'sergipe': 'SE',
  'tocantins': 'TO',
};

/**
 * Retorna o bioma predominante de um estado brasileiro
 */
export function getStateDefaultBiome(stateId: string): import('../types').BrazilBiome {
  const uf = (stateId || '').toUpperCase();
  if (['AM', 'PA', 'AC', 'RO', 'RR', 'AP'].includes(uf)) return 'Amazônia';
  if (['CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'PI'].includes(uf)) return 'Caatinga';
  if (['DF', 'GO', 'TO', 'MT', 'MA'].includes(uf)) return 'Cerrado';
  if (['MS'].includes(uf)) return 'Pantanal';
  if (['RS'].includes(uf)) return 'Pampa';
  if (['SP', 'RJ', 'ES', 'MG', 'PR', 'SC'].includes(uf)) return 'Mata Atlântica';
  return 'Amazônia';
}

// Centróides e Nomes Oficiais das 27 Unidades Federativas do Brasil
export const BRAZIL_STATE_LAT_LNG: Record<
  string,
  { lat: number; lng: number; name: string; regionId: string }
> = {
  AC: { lat: -9.0238, lng: -70.812, name: 'Acre', regionId: 'norte' },
  AL: { lat: -9.5713, lng: -36.782, name: 'Alagoas', regionId: 'nordeste' },
  AP: { lat: 0.902, lng: -52.003, name: 'Amapá', regionId: 'norte' },
  AM: { lat: -3.4168, lng: -65.8561, name: 'Amazonas', regionId: 'norte' },
  BA: { lat: -12.5797, lng: -41.7007, name: 'Bahia', regionId: 'nordeste' },
  CE: { lat: -5.4984, lng: -39.3206, name: 'Ceará', regionId: 'nordeste' },
  DF: { lat: -15.7998, lng: -47.8645, name: 'Distrito Federal', regionId: 'centro_oeste' },
  ES: { lat: -19.1834, lng: -40.3089, name: 'Espírito Santo', regionId: 'sudeste' },
  GO: { lat: -15.827, lng: -49.8362, name: 'Goiás', regionId: 'centro_oeste' },
  MA: { lat: -4.9609, lng: -45.2744, name: 'Maranhão', regionId: 'nordeste' },
  MT: { lat: -12.6819, lng: -56.9211, name: 'Mato Grosso', regionId: 'centro_oeste' },
  MS: { lat: -20.7722, lng: -54.7852, name: 'Mato Grosso do Sul', regionId: 'centro_oeste' },
  MG: { lat: -18.5122, lng: -44.555, name: 'Minas Gerais', regionId: 'sudeste' },
  PA: { lat: -1.9981, lng: -54.9306, name: 'Pará', regionId: 'norte' },
  PB: { lat: -7.2399, lng: -36.7819, name: 'Paraíba', regionId: 'nordeste' },
  PR: { lat: -25.2521, lng: -52.0215, name: 'Paraná', regionId: 'sul' },
  PE: { lat: -8.8137, lng: -36.9541, name: 'Pernambuco', regionId: 'nordeste' },
  PI: { lat: -7.7183, lng: -42.7289, name: 'Piauí', regionId: 'nordeste' },
  RJ: { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', regionId: 'sudeste' },
  RN: { lat: -5.7945, lng: -36.5616, name: 'Rio Grande do Norte', regionId: 'nordeste' },
  RS: { lat: -30.0346, lng: -51.2177, name: 'Rio Grande do Sul', regionId: 'sul' },
  RO: { lat: -11.5057, lng: -63.5806, name: 'Rondônia', regionId: 'norte' },
  RR: { lat: 2.7376, lng: -62.0751, name: 'Roraima', regionId: 'norte' },
  SC: { lat: -27.2423, lng: -50.2189, name: 'Santa Catarina', regionId: 'sul' },
  SP: { lat: -23.5505, lng: -46.6333, name: 'São Paulo', regionId: 'sudeste' },
  SE: { lat: -10.5741, lng: -37.3857, name: 'Sergipe', regionId: 'nordeste' },
  TO: { lat: -10.1753, lng: -48.2982, name: 'Tocantins', regionId: 'norte' },
};

/**
 * Normaliza qualquer string ou ID para o código UF de 2 letras (ex: 'BRSP' -> 'SP', 'São Paulo' -> 'SP')
 */
export function normalizeStateId(rawInput: string): string | null {
  if (!rawInput) return null;
  const cleaned = rawInput
    .trim()
    .toUpperCase()
    .replace(/^BR[-_]?/i, '');

  if (BRAZIL_STATE_LAT_LNG[cleaned]) {
    return cleaned;
  }

  const normalizedName = rawInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Match exato prioritário
  for (const [key, uf] of Object.entries(STATE_NAME_TO_UF)) {
    const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedName === normKey) {
      return uf;
    }
  }

  // 2. Match ordenado pelos nomes mais longos primeiro (ex: "rio grande do sul", "mato grosso do sul", "parana" antes de "para")
  const sortedEntries = Object.entries(STATE_NAME_TO_UF).sort((a, b) => b[0].length - a[0].length);
  for (const [key, uf] of sortedEntries) {
    const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const regex = new RegExp(`\\b${normKey}\\b`, 'i');
    if (regex.test(normalizedName) || normalizedName.includes(normKey)) {
      return uf;
    }
  }

  return null;
}

/**
 * Algoritmo de Ray-Casting para testar se um ponto (lng, lat) está dentro de um anel poligonal.
 */
function isPointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Testa se um ponto (lng, lat) está dentro de uma geometria Polygon ou MultiPolygon
 */
function isPointInGeometry(lng: number, lat: number, geometry: any): boolean {
  if (!geometry || !geometry.coordinates) return false;
  const { type, coordinates } = geometry;

  if (type === 'Polygon') {
    if (coordinates.length > 0 && isPointInRing(lng, lat, coordinates[0])) {
      for (let i = 1; i < coordinates.length; i++) {
        if (isPointInRing(lng, lat, coordinates[i])) {
          return false; // Dentro de um buraco interior
        }
      }
      return true;
    }
  } else if (type === 'MultiPolygon') {
    for (const poly of coordinates) {
      if (poly.length > 0 && isPointInRing(lng, lat, poly[0])) {
        let insideHole = false;
        for (let i = 1; i < poly.length; i++) {
          if (isPointInRing(lng, lat, poly[i])) {
            insideHole = true;
            break;
          }
        }
        if (!insideHole) return true;
      }
    }
  }
  return false;
}

/**
 * Distância euclidiana ao quadrado de um ponto a um segmento de reta
 */
function pointToSegmentDistanceSquared(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) {
    const ddx = px - x1;
    const ddy = py - y1;
    return ddx * ddx + ddy * ddy;
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const dpx = px - projX;
  const dpy = py - projY;
  return dpx * dpx + dpy * dpy;
}

function minDistanceToRing(lng: number, lat: number, ring: number[][]): number {
  let minD2 = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const d2 = pointToSegmentDistanceSquared(lng, lat, ring[j][0], ring[j][1], ring[i][0], ring[i][1]);
    if (d2 < minD2) minD2 = d2;
  }
  return minD2;
}

/**
 * Calcula a distância mínima em graus de um ponto até a fronteira/costa de um estado
 */
function minDistanceToGeometry(lng: number, lat: number, geometry: any): number {
  let minD2 = Infinity;
  if (!geometry || !geometry.coordinates) return minD2;
  const { type, coordinates } = geometry;
  if (type === 'Polygon') {
    for (const ring of coordinates) {
      const d2 = minDistanceToRing(lng, lat, ring);
      if (d2 < minD2) minD2 = d2;
    }
  } else if (type === 'MultiPolygon') {
    for (const poly of coordinates) {
      for (const ring of poly) {
        const d2 = minDistanceToRing(lng, lat, ring);
        if (d2 < minD2) minD2 = d2;
      }
    }
  }
  return Math.sqrt(minD2);
}

/**
 * Calcula a distância euclidiana/haversine simplificada em km entre dois pontos lat/lng
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Tenta reverse geocoding via proxy local do servidor (/api/geolocation/reverse)
 * com fallback direto para Nominatim OpenStreetMap
 */
async function reverseGeocodeCoords(lat: number, lng: number): Promise<string | null> {
  // 1. Tentar Proxy do Servidor Local (alta confiabilidade, headers oficiais e sem restrições de CORS)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`/api/geolocation/reverse?lat=${lat}&lng=${lng}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.stateId && BRAZIL_STATE_LAT_LNG[data.stateId]) {
        return data.stateId;
      }
    }
  } catch {
    // Prossegue para tentativa direta no cliente se o servidor estiver ocupado
  }

  // 2. Tentar OpenStreetMap Nominatim direto no cliente
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const address = data.address || {};
      const iso = (address['ISO3166-2-lvl4'] || '').replace(/^BR[-_]?/i, '').toUpperCase();
      if (iso && BRAZIL_STATE_LAT_LNG[iso]) {
        return iso;
      }
      const stateName = address.state || address.province || address.region || '';
      const uf = normalizeStateId(stateName);
      if (uf) return uf;
    }
  } catch {
    // Falha silenciosa para prosseguir para o teste poligonal GeoJSON
  }

  return null;
}

/**
 * Identifica o estado brasileiro exato via Reverse Geocoding + Ray-Casting GeoJSON IBGE + Distância de Fronteira
 */
export async function identifyBrazilianState(
  lat: number,
  lng: number
): Promise<{ stateId: string; stateName: string; regionId: string; source: 'reverse_geocoding' | 'polygon' | 'gps' }> {
  // 1. Tenta Reverse Geocoding com as coordenadas exatas (Proxy Servidor + Nominatim IBGE)
  const revUf = await reverseGeocodeCoords(lat, lng);
  if (revUf && BRAZIL_STATE_LAT_LNG[revUf]) {
    const info = BRAZIL_STATE_LAT_LNG[revUf];
    return {
      stateId: revUf,
      stateName: info.name,
      regionId: info.regionId,
      source: 'reverse_geocoding',
    };
  }

  // 2. Tenta Ray-Casting e Distância de Fronteira nos Polígonos GeoJSON oficiais do IBGE (/br/br.json)
  try {
    let geoData = getCachedGeoData();
    if (!geoData) {
      geoData = await loadBrazilGeoData();
    }

    if (geoData && Array.isArray(geoData.features)) {
      // 2.A: Teste de inclusão direta de polígono (Ray-Casting)
      for (const feature of geoData.features) {
        if (isPointInGeometry(lng, lat, feature.geometry)) {
          const rawPropId = feature.properties?.id || feature.properties?.sigla || '';
          const uf = normalizeStateId(rawPropId) || normalizeStateId(feature.properties?.name || '');
          if (uf && BRAZIL_STATE_LAT_LNG[uf]) {
            const info = BRAZIL_STATE_LAT_LNG[uf];
            return {
              stateId: uf,
              stateName: info.name,
              regionId: info.regionId,
              source: 'polygon',
            };
          }
        }
      }

      // 2.B: Se o ponto estiver em cidades litorâneas, ilhas (ex: Vitória, Florianópolis, Santos)
      // ou regiões de fronteira, encontra a geometria estadual mais próxima pela linha de divisa
      let closestStateId: string | null = null;
      let minBorderDist = Infinity;

      for (const feature of geoData.features) {
        const rawPropId = feature.properties?.id || feature.properties?.sigla || '';
        const uf = normalizeStateId(rawPropId) || normalizeStateId(feature.properties?.name || '');
        if (uf && BRAZIL_STATE_LAT_LNG[uf]) {
          const distDeg = minDistanceToGeometry(lng, lat, feature.geometry);
          if (distDeg < minBorderDist) {
            minBorderDist = distDeg;
            closestStateId = uf;
          }
        }
      }

      // Se a distância até a fronteira for menor que ~1.0 grau (~110 km), confirma o estado costeiro
      if (closestStateId && minBorderDist < 1.0) {
        const info = BRAZIL_STATE_LAT_LNG[closestStateId];
        return {
          stateId: closestStateId,
          stateName: info.name,
          regionId: info.regionId,
          source: 'polygon',
        };
      }
    }
  } catch (err) {
    console.warn('Fallback para aproximação por centróide devido a erro ao carregar GeoJSON:', err);
  }

  // 3. Fallback final: Centróide oficial mais próximo
  let nearestStateId = 'DF';
  let minDistance = Infinity;

  for (const [stateId, info] of Object.entries(BRAZIL_STATE_LAT_LNG)) {
    const dist = calculateDistanceKm(lat, lng, info.lat, info.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStateId = stateId;
    }
  }

  const info = BRAZIL_STATE_LAT_LNG[nearestStateId];
  return {
    stateId: nearestStateId,
    stateName: info.name,
    regionId: info.regionId,
    source: 'gps',
  };
}

/**
 * Fallback via serviço de IP exclusivo para conexões em território brasileiro
 * NUNCA retorna estados arbitrários se o IP estiver fora do Brasil (ex: US, proxies em nuvem)
 */
async function getFallbackIpLocation(): Promise<GeoLocationResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      // Valida estritamente se o IP detectado é do Brasil
      const countryCode = (data.country_code || data.country_code3 || '').toUpperCase();
      if (countryCode !== 'BR' && countryCode !== 'BRA') {
        return null; // IP fora do Brasil, não gera falso positivo
      }

      const rawRegion = data.region || data.city || '';
      const uf = normalizeStateId(rawRegion);
      if (uf && BRAZIL_STATE_LAT_LNG[uf]) {
        const info = BRAZIL_STATE_LAT_LNG[uf];
        return {
          latitude: info.lat,
          longitude: info.lng,
          accuracy: 15000,
          detectedStateId: uf,
          stateName: info.name,
          regionId: info.regionId,
          source: 'ip',
        };
      }
    }
  } catch {
    // tenta ipwho.is como contingência
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const countryCode = (data.country_code || '').toUpperCase();
        if (countryCode !== 'BR') {
          return null; // IP fora do Brasil
        }
        const rawRegion = data.region || data.region_code || '';
        const uf = normalizeStateId(rawRegion);
        if (uf && BRAZIL_STATE_LAT_LNG[uf]) {
          const info = BRAZIL_STATE_LAT_LNG[uf];
          return {
            latitude: info.lat,
            longitude: info.lng,
            accuracy: 15000,
            detectedStateId: uf,
            stateName: info.name,
            regionId: info.regionId,
            source: 'ip',
          };
        }
      }
    } catch {
      // Falha total de IP
    }
  }
  return null;
}

/**
 * Solicita autorização de geolocalização ao navegador e retorna o estado detectado com máxima precisão
 */
export async function requestUserGeolocation(): Promise<GeoLocationResult> {
  // Se navigator.geolocation estiver disponível, tenta primeiro via GPS nativo do dispositivo
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          {
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 30000,
          }
        );
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const stateInfo = await identifyBrazilianState(lat, lng);

      return {
        latitude: lat,
        longitude: lng,
        accuracy: position.coords.accuracy,
        detectedStateId: stateInfo.stateId,
        stateName: stateInfo.stateName,
        regionId: stateInfo.regionId,
        source: stateInfo.source,
      };
    } catch (gpsError: any) {
      console.warn('GPS do dispositivo não autorizou ou expirou timeout:', gpsError?.message);
    }
  }

  // Fallback por IP (apenas se for IP comprovadamente brasileiro)
  const ipResult = await getFallbackIpLocation();
  if (ipResult) {
    return ipResult;
  }

  // Quando não for possível detectar com exatidão, lança erro informativo em vez de forçar estado aleatório
  throw new Error('Não foi possível identificar sua localização automaticamente. Selecione seu estado no menu ou mapa.');
}


