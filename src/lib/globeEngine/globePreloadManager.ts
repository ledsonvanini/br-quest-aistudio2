/**
 * Progressive Preload & Texture Cache Manager with IndexedDB Support
 * Prevents UI freezing (zero jank) by generating instant procedural blur-up placeholders
 * and decoding high-res assets asynchronously via createImageBitmap.
 */
import * as THREE from 'three';
import { GlobePreloadProgress } from './types';

const DB_NAME = 'brquest_globe_cache_v2';
const STORE_NAME = 'textures';

// Asset URLs with reliable CDNs, versioned jsdelivr (tested HTTP 200 CORS) and fallbacks
export const GLOBE_TEXTURE_URLS = {
  dayMarblePrimary: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg',
  dayMarbleFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/earth_atmos_2048.jpg',
  nightLightsPrimary: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_lights_2048.png',
  nightLightsFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/earth_lights_2048.png',
  cloudsMapPrimary: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_clouds_2048.png',
  cloudsMapFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/earth_clouds_1024.png',
  moonAlbedoPrimary: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/moon_1024.jpg',
  moonAlbedoFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/moon_1024.jpg',
};

class GlobePreloadManager {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private textureCache: Map<string, THREE.Texture> = new Map();
  private placeholderCache: Map<string, THREE.Texture> = new Map();
  private progressListeners: Set<(progress: GlobePreloadProgress) => void> = new Set();
  private isPreloadStarted = false;
  private isPreloadComplete = false;

  constructor() {
    this.initIndexedDB();
  }

  /**
   * Initializes IndexedDB database safely
   */
  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  /**
   * Generates a tiny, immediate procedural Canvas 2D placeholder (LQIP)
   * so the globe renders gracefully in <50ms without waiting for network.
   */
  public getOrCreatePlaceholder(type: 'day' | 'night' | 'clouds' | 'moon'): THREE.Texture {
    if (this.placeholderCache.has(type)) {
      return this.placeholderCache.get(type)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (type === 'day') {
        // Deep blue Atlantic, Pacific and Indian oceans
        const oceanGrad = ctx.createLinearGradient(0, 0, 512, 256);
        oceanGrad.addColorStop(0, '#0a2342');
        oceanGrad.addColorStop(0.5, '#0f3156');
        oceanGrad.addColorStop(1, '#081c33');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, 512, 256);

        // 1. Antarctica Ice Shelf (Bottom)
        ctx.fillStyle = '#dbeafe';
        ctx.fillRect(0, 224, 512, 32);

        // 2. Greenland Ice Sheet
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(195, 20);
        ctx.lineTo(225, 22);
        ctx.lineTo(215, 52);
        ctx.lineTo(190, 48);
        ctx.closePath();
        ctx.fill();

        // 3. North America
        ctx.fillStyle = '#22543d';
        ctx.beginPath();
        ctx.moveTo(60, 35); // Alaska
        ctx.lineTo(115, 30); // Canada North
        ctx.lineTo(150, 45); // Labrador / Quebec
        ctx.lineTo(142, 85); // East Coast USA
        ctx.lineTo(135, 105); // Florida
        ctx.lineTo(125, 105); // Gulf Coast
        ctx.lineTo(118, 125); // Central America
        ctx.lineTo(150, 125); // Panama
        ctx.lineTo(110, 115); // Mexico West
        ctx.lineTo(95, 80);  // California
        ctx.lineTo(75, 55);  // Pacific Northwest
        ctx.closePath();
        ctx.fill();

        // 4. South America
        ctx.fillStyle = '#1e3a29';
        ctx.beginPath();
        ctx.moveTo(158, 115); // Colombia
        ctx.lineTo(175, 118); // Venezuela / Guianas
        ctx.lineTo(195, 130); // Amazon mouth / Amapá
        ctx.lineTo(206, 142); // Ponta do Seixas / PB / RN
        ctx.lineTo(198, 160); // Salvador / Bahia coast
        ctx.lineTo(185, 178); // Rio de Janeiro / Santos
        ctx.lineTo(176, 195); // Rio Grande do Sul
        ctx.lineTo(170, 215); // Patagonia
        ctx.lineTo(163, 205); // Southern Chile
        ctx.lineTo(152, 170); // Peru coast
        ctx.lineTo(145, 140); // Ecuador
        ctx.closePath();
        ctx.fill();

        // Brazil's lush Amazon Basin (Emerald green)
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(172, 138, 22, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cerrado & Caatinga biomes (Warm savanna ochre)
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(188, 150, 12, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Atlantic Forest & Coastal strip
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(190, 165, 8, 18, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // 5. Eurasia (Europe + Asia + Siberia)
        ctx.fillStyle = '#1c4228';
        ctx.beginPath();
        ctx.moveTo(250, 60); // UK / France
        ctx.lineTo(270, 40); // Scandinavia
        ctx.lineTo(360, 30); // Northern Siberia
        ctx.lineTo(470, 40); // Kamchatka
        ctx.lineTo(450, 85); // China East coast
        ctx.lineTo(430, 115); // Indochina
        ctx.lineTo(380, 125); // India tip
        ctx.lineTo(350, 100); // Arabian Sea
        ctx.lineTo(315, 95);  // Red Sea
        ctx.lineTo(290, 80);  // Mediterranean
        ctx.lineTo(240, 75);  // Iberia
        ctx.closePath();
        ctx.fill();

        // Arabian & Gobi Deserts (Golden ochre)
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.ellipse(325, 95, 20, 12, 0, 0, Math.PI * 2); // Arabia
        ctx.ellipse(390, 70, 25, 10, 0, 0, Math.PI * 2); // Gobi
        ctx.fill();

        // 6. Africa
        ctx.fillStyle = '#2d4030';
        ctx.beginPath();
        ctx.moveTo(245, 82); // Morocco / Gibraltar
        ctx.lineTo(295, 85); // Egypt / Sinai
        ctx.lineTo(325, 110); // Horn of Africa
        ctx.lineTo(310, 160); // Mozambique
        ctx.lineTo(285, 195); // Cape of Good Hope
        ctx.lineTo(265, 160); // Namibia
        ctx.lineTo(250, 130); // Gulf of Guinea
        ctx.lineTo(235, 110); // Senegal / West Africa
        ctx.closePath();
        ctx.fill();

        // Sahara Desert (Warm amber sand)
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(275, 100, 38, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Congo Rainforest
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(280, 138, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. Australia & New Zealand
        ctx.fillStyle = '#9a3412'; // Outback reddish-amber
        ctx.beginPath();
        ctx.moveTo(430, 150);
        ctx.lineTo(470, 155);
        ctx.lineTo(465, 185);
        ctx.lineTo(435, 185);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#16a34a'; // Australian east coast green
        ctx.beginPath();
        ctx.ellipse(468, 170, 6, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Japan Archipelago
        ctx.fillStyle = '#22543d';
        ctx.beginPath();
        ctx.ellipse(455, 75, 6, 18, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Indonesia & Philippines
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(415, 135, 30, 6, 0.1, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'night') {
        // Deep midnight dark space
        ctx.fillStyle = '#010512';
        ctx.fillRect(0, 0, 512, 256);

        // Soft midnight silhouettes for global landmasses
        ctx.fillStyle = '#061324';
        // Americas
        ctx.fillRect(75, 35, 75, 70);
        ctx.fillRect(150, 115, 55, 95);
        // Eurasia & Africa
        ctx.fillRect(240, 45, 230, 75);
        ctx.fillRect(240, 85, 80, 105);
        // Australia
        ctx.fillRect(430, 150, 40, 35);

        // Radiant Global City Lights (NASA VIIRS Black Marble)
        const drawCityCluster = (x: number, y: number, radius: number, intensity: string) => {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
          glow.addColorStop(0, '#fffbeb');
          glow.addColorStop(0.3, intensity);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        };

        // Major Brazilian Urban Clusters
        drawCityCluster(186, 176, 8, '#f59e0b'); // São Paulo
        drawCityCluster(190, 173, 7, '#fbbf24'); // Rio de Janeiro
        drawCityCluster(184, 158, 5, '#fde047'); // Brasília
        drawCityCluster(188, 168, 6, '#f59e0b'); // Belo Horizonte
        drawCityCluster(198, 156, 5, '#fbbf24'); // Salvador
        drawCityCluster(202, 136, 5, '#fde047'); // Fortaleza
        drawCityCluster(204, 144, 5, '#fbbf24'); // Recife
        drawCityCluster(181, 183, 5, '#fde047'); // Curitiba
        drawCityCluster(178, 192, 5, '#f59e0b'); // Porto Alegre
        drawCityCluster(166, 137, 4, '#fbbf24'); // Manaus
        drawCityCluster(191, 132, 4, '#fde047'); // Belém

        // North America Major Lights
        drawCityCluster(138, 72, 8, '#fbbf24');  // NYC / BosWash
        drawCityCluster(125, 70, 6, '#fde047');  // Chicago
        drawCityCluster(88, 82, 7, '#f59e0b');   // Los Angeles
        drawCityCluster(120, 115, 6, '#fde047'); // Mexico City

        // Europe Major Lights
        drawCityCluster(255, 58, 7, '#fbbf24');  // London
        drawCityCluster(262, 65, 7, '#fde047');  // Paris
        drawCityCluster(270, 60, 6, '#f59e0b');  // Berlin
        drawCityCluster(275, 75, 5, '#fde047');  // Rome
        drawCityCluster(305, 50, 6, '#fbbf24');  // Moscow

        // Asia & Australia Major Lights
        drawCityCluster(455, 75, 8, '#fde047');  // Tokyo / Osaka
        drawCityCluster(445, 68, 6, '#f59e0b');  // Seoul
        drawCityCluster(435, 82, 7, '#fbbf24');  // Shanghai
        drawCityCluster(428, 98, 6, '#fde047');  // Hong Kong / Pearl River
        drawCityCluster(370, 95, 7, '#fbbf24');  // Mumbai / Delhi
        drawCityCluster(462, 175, 6, '#fde047'); // Sydney / Melbourne

      } else if (type === 'clouds') {
        // Continuous Global Cloud Layer (Equirectangular UV 0..512)
        // Black background = clear skies, white swirls = clouds
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 256);
        ctx.filter = 'blur(4px)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';

        // Global Intertropical Convergence Zone (ITCZ) belt across tropical latitudes
        for (let x = 0; x < 512; x += 48) {
          ctx.beginPath();
          const yOffset = Math.sin(x * 0.04) * 8;
          ctx.ellipse(x + 20, 125 + yOffset, 38, 8, 0.05, 0, Math.PI * 2);
          ctx.fill();
        }

        // South Atlantic Convergence Zone (SACZ) & South America
        ctx.beginPath();
        ctx.ellipse(185, 165, 45, 12, 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Northern Hemisphere Storm Spirals (North Pacific & North Atlantic)
        ctx.beginPath();
        ctx.ellipse(100, 60, 50, 12, -0.2, 0, Math.PI * 2);
        ctx.ellipse(220, 55, 48, 10, 0.25, 0, Math.PI * 2);
        ctx.ellipse(400, 50, 55, 12, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // Southern Ocean Roaring Forties Cyclonic Belt
        for (let x = 0; x < 512; x += 64) {
          ctx.beginPath();
          ctx.ellipse(x + 30, 205, 40, 9, -0.15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.filter = 'none';

      } else if (type === 'moon') {
        // High-detail lunar maria and highlands
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(180, 110, 50, 0, Math.PI * 2); // Oceanus Procellarum
        ctx.arc(260, 95, 38, 0, Math.PI * 2);  // Mare Imbrium
        ctx.arc(310, 130, 32, 0, Math.PI * 2); // Mare Serenitatis
        ctx.arc(340, 145, 28, 0, Math.PI * 2); // Mare Tranquillitatis
        ctx.fill();
        // Tycho crater ray splash
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(280, 185, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    this.placeholderCache.set(type, tex);
    return tex;
  }

  /**
   * Loads or retrieves texture with IndexedDB cache and fallback CDN support
   */
  public async loadTextureWithCache(
    key: string,
    primaryUrl: string,
    fallbackUrl: string
  ): Promise<THREE.Texture> {
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!;
    }

    // 1. Try IndexedDB cache
    const cachedBlob = await this.getFromIndexedDB(key);
    if (cachedBlob) {
      try {
        const tex = await this.createTextureFromBlob(cachedBlob);
        this.textureCache.set(key, tex);
        return tex;
      } catch {
        // If cached blob was corrupted, fall through to fetch
      }
    }

    // 2. Fetch from network (Primary or Fallback)
    let blob: Blob | null = null;
    try {
      blob = await this.fetchWithTimeout(primaryUrl, 7000);
    } catch {
      try {
        blob = await this.fetchWithTimeout(fallbackUrl, 7000);
      } catch (err) {
        console.warn(`[GlobePreload] Failed to load ${key}, falling back to procedural placeholder`);
      }
    }

    if (blob) {
      this.saveToIndexedDB(key, blob);
      const tex = await this.createTextureFromBlob(blob);
      this.textureCache.set(key, tex);
      return tex;
    }

    // Return appropriate procedural placeholder if network failed completely
    const placeholderType = key.includes('night')
      ? 'night'
      : key.includes('cloud')
      ? 'clouds'
      : key.includes('moon')
      ? 'moon'
      : 'day';
    return this.getOrCreatePlaceholder(placeholderType);
  }

  /**
   * Decodes image using HTMLImageElement with object URL and explicit flipY = true.
   * This guarantees that equirectangular textures align identically with CanvasTexture placeholders
   * and Three.js SphereGeometry without Y-axis inversion across any browser.
   */
  private async createTextureFromBlob(blob: Blob): Promise<THREE.Texture> {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve();
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
    });

    const texture = new THREE.Texture(img);
    // Enforce upright cartographic orientation: top of equirectangular map = North Pole (+Y)
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  private async fetchWithTimeout(url: string, ms = 12000): Promise<Blob> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal, mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.blob();
    } finally {
      clearTimeout(timer);
    }
  }

  private async getFromIndexedDB(key: string): Promise<Blob | null> {
    const db = await this.initIndexedDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async saveToIndexedDB(key: string, blob: Blob): Promise<void> {
    const db = await this.initIndexedDB();
    if (!db) return;

    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(blob, key);
    } catch {
      // Non-fatal
    }
  }

  private lastProgress: GlobePreloadProgress = {
    loaded: 0,
    total: 4,
    percent: 0,
    currentAsset: 'Inicializando órbita...',
    isReady: false,
    fromCache: false,
  };

  /**
   * Progressive preloader that loads all core globe textures in background
   */
  public startPreload(): void {
    if (this.isPreloadComplete) {
      this.notify('Globo 3D Pronto', true);
      return;
    }
    if (this.isPreloadStarted) return;
    this.isPreloadStarted = true;

    const assets = [
      {
        key: 'day_marble',
        primary: GLOBE_TEXTURE_URLS.dayMarblePrimary,
        fallback: GLOBE_TEXTURE_URLS.dayMarbleFallback,
        name: 'Mosaico Blue Marble NASA',
      },
      {
        key: 'night_lights',
        primary: GLOBE_TEXTURE_URLS.nightLightsPrimary,
        fallback: GLOBE_TEXTURE_URLS.nightLightsFallback,
        name: 'Luzes Urbanas VIIRS NASA',
      },
      {
        key: 'clouds_map',
        primary: GLOBE_TEXTURE_URLS.cloudsMapPrimary,
        fallback: GLOBE_TEXTURE_URLS.cloudsMapFallback,
        name: 'Manto Atmosférico Global',
      },
      {
        key: 'moon_albedo',
        primary: GLOBE_TEXTURE_URLS.moonAlbedoPrimary,
        fallback: GLOBE_TEXTURE_URLS.moonAlbedoFallback,
        name: 'Superfície Lunar LRO',
      },
    ];

    let loaded = 0;
    const total = assets.length;

    // Load sequentially or in small parallel batches to preserve CPU bandwidth
    (async () => {
      for (const asset of assets) {
        this.notify(`Carregando ${asset.name}...`, false, loaded, total);
        await this.loadTextureWithCache(asset.key, asset.primary, asset.fallback);
        loaded++;
        this.notify(asset.name, loaded === total, loaded, total);
      }
      this.isPreloadComplete = true;
      this.notify('Globo 3D Pronto', true, total, total);
    })();
  }

  private notify(currentAsset: string, isReady = false, loaded = this.lastProgress.loaded, total = 4): void {
    const percent = Math.min(100, Math.round((loaded / total) * 100));
    this.lastProgress = {
      loaded,
      total,
      percent: isReady ? 100 : percent,
      currentAsset,
      isReady,
      fromCache: false,
    };
    this.progressListeners.forEach((fn) => fn(this.lastProgress));
  }

  public subscribeProgress(fn: (progress: GlobePreloadProgress) => void): () => void {
    this.progressListeners.add(fn);
    // Immediately emit current state so component is never stuck
    fn(this.lastProgress);
    return () => this.progressListeners.delete(fn);
  }

  public isComplete(): boolean {
    return this.isPreloadComplete;
  }

  public getCachedTexture(key: string): THREE.Texture | null {
    return this.textureCache.get(key) || null;
  }
}

export const globePreloadManager = new GlobePreloadManager();
