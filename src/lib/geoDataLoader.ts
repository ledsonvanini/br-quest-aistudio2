import { apiTracker } from '../services/apiTracker';

let cachedGeoJson: any = null;
let pendingPromise: Promise<any> | null = null;

let cachedSouthAmericaGeoJson: any = null;
let pendingSouthAmericaPromise: Promise<any> | null = null;

/**
 * Loads and caches the Brazil states GeoJSON data in memory.
 * Subsequent calls resolve instantly without network round-trips.
 */
export async function loadBrazilGeoData(): Promise<any> {
  if (cachedGeoJson) {
    apiTracker.trackCall('ibge-geo', '/br/br.json (Mem Cache)', 0, 'cached', 200, '27 polígonos estaduais servidos da memória');
    return cachedGeoJson;
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  const startTime = performance.now();
  pendingPromise = (async () => {
    try {
      const response = await fetch('/br/br.json');
      const duration = performance.now() - startTime;
      if (!response.ok) {
        apiTracker.trackCall('ibge-geo', '/br/br.json', duration, 'error', response.status, `HTTP error ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      cachedGeoJson = data;
      const sizeKb = JSON.stringify(data).length / 1024;
      apiTracker.trackCall('ibge-geo', '/br/br.json (IBGE GeoJSON)', duration, 'success', 200, '27 UFs vetorizadas em alta precisão', sizeKb);
      return data;
    } catch (err) {
      console.error('Failed to load GeoJSON data:', err);
      throw err;
    } finally {
      pendingPromise = null;
    }
  })();

  return pendingPromise;
}

/**
 * Loads and caches the South America neighboring countries GeoJSON data.
 */
export async function loadSouthAmericaGeoData(): Promise<any> {
  if (cachedSouthAmericaGeoJson) {
    return cachedSouthAmericaGeoJson;
  }

  if (pendingSouthAmericaPromise) {
    return pendingSouthAmericaPromise;
  }

  pendingSouthAmericaPromise = (async () => {
    try {
      const response = await fetch('/br/south-america-neighbors.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      cachedSouthAmericaGeoJson = data;
      return data;
    } catch (err) {
      console.error('Failed to load South America GeoJSON data:', err);
      throw err;
    } finally {
      pendingSouthAmericaPromise = null;
    }
  })();

  return pendingSouthAmericaPromise;
}

/**
 * Synchronous getter if already loaded
 */
export function getCachedGeoData(): any | null {
  return cachedGeoJson;
}

export function getCachedSouthAmericaGeoData(): any | null {
  return cachedSouthAmericaGeoJson;
}
