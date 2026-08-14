let cachedGeoJson: any = null;
let pendingPromise: Promise<any> | null = null;

/**
 * Loads and caches the Brazil states GeoJSON data in memory.
 * Subsequent calls resolve instantly without network round-trips.
 */
export async function loadBrazilGeoData(): Promise<any> {
  if (cachedGeoJson) {
    return cachedGeoJson;
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = (async () => {
    try {
      const response = await fetch('/br/br.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      cachedGeoJson = data;
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
 * Synchronous getter if already loaded
 */
export function getCachedGeoData(): any | null {
  return cachedGeoJson;
}
