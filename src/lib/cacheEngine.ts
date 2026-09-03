/**
 * Motor Genérico de Cache Multi-Nível (L1 Memória + L2 LocalStorage + Deduplicação em Voo)
 * Projeto: BR Quest / Brasil Interativo
 * 
 * Garante performance a 60 FPS, resiliência contra erros 429 de APIs externas
 * e reaproveitamento de chamadas concorrentes.
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export interface MultiTierCacheOptions {
  namespace: string;
  defaultTtlMs?: number;
  maxMemoryItems?: number;
  enableLocalStorage?: boolean;
}

export class MultiTierCache<T> {
  private readonly namespace: string;
  private readonly defaultTtlMs: number;
  private readonly maxMemoryItems: number;
  private readonly enableLocalStorage: boolean;

  // Nível 1: Memória Rápida (RAM síncrona)
  private memoryCache = new Map<string, CacheEntry<T>>();

  // Deduplicação de requisições em voo (In-flight promise sharing)
  private inFlightRequests = new Map<string, Promise<T>>();

  constructor(options: MultiTierCacheOptions) {
    this.namespace = options.namespace;
    this.defaultTtlMs = options.defaultTtlMs ?? 1000 * 60 * 60 * 6; // 6 horas default
    this.maxMemoryItems = options.maxMemoryItems ?? 100;
    this.enableLocalStorage = options.enableLocalStorage ?? true;
  }

  private getStorageKey(key: string): string {
    return `br_quest_cache_${this.namespace}_${key}`;
  }

  /**
   * Obtém valor do cache L1 (Memória) ou L2 (LocalStorage) se válido.
   */
  public get(key: string): T | null {
    const now = Date.now();

    // 1. Tenta L1 (Memória)
    const memEntry = this.memoryCache.get(key);
    if (memEntry) {
      if (now - memEntry.timestamp < memEntry.ttlMs) {
        return memEntry.data;
      }
      this.memoryCache.delete(key);
    }

    // 2. Tenta L2 (LocalStorage)
    if (this.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(this.getStorageKey(key));
        if (raw) {
          const entry: CacheEntry<T> = JSON.parse(raw);
          if (now - entry.timestamp < entry.ttlMs) {
            // Promove de volta para L1
            this.setMemory(key, entry.data, entry.ttlMs - (now - entry.timestamp));
            return entry.data;
          }
          localStorage.removeItem(this.getStorageKey(key));
        }
      } catch (e) {
        // Falha silenciosa de JSON ou cota
      }
    }

    return null;
  }

  /**
   * Salva no cache L1 e L2 com TTL específico ou default.
   */
  public set(key: string, data: T, customTtlMs?: number): void {
    const ttlMs = customTtlMs ?? this.defaultTtlMs;
    const now = Date.now();
    const entry: CacheEntry<T> = { data, timestamp: now, ttlMs };

    // Grava L1
    this.setMemory(key, data, ttlMs);

    // Grava L2
    if (this.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.getStorageKey(key), JSON.stringify(entry));
      } catch (e) {
        // Se exceder a cota, limpa chaves expiradas deste namespace
        this.pruneExpiredLocalStorage();
      }
    }
  }

  private setMemory(key: string, data: T, ttlMs: number): void {
    if (this.memoryCache.size >= this.maxMemoryItems) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }
    this.memoryCache.set(key, { data, timestamp: Date.now(), ttlMs });
  }

  /**
   * Obtém do cache ou executa o fetcher com compartilhamento de requisição em voo.
   */
  public async getOrFetch(
    key: string,
    fetcher: () => Promise<T>,
    customTtlMs?: number,
    fallbackValue?: T
  ): Promise<T> {
    // 1. Verifica cache existente
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // 2. Se já existe uma requisição em andamento para esta mesma chave, reaproveita a Promise
    const inFlight = this.inFlightRequests.get(key);
    if (inFlight) {
      return inFlight;
    }

    // 3. Dispara a requisição compartilhada
    const requestPromise = (async () => {
      try {
        const result = await fetcher();
        if (result !== undefined && result !== null) {
          this.set(key, result, customTtlMs);
        }
        return result;
      } catch (err) {
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        throw err;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Remove entradas expiradas do LocalStorage para evitar overflow de cota.
   */
  public pruneExpiredLocalStorage(): void {
    if (!this.enableLocalStorage || typeof window === 'undefined' || !window.localStorage) return;
    try {
      const prefix = `br_quest_cache_${this.namespace}_`;
      const now = Date.now();
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const entry: CacheEntry<any> = JSON.parse(raw);
              if (now - entry.timestamp >= entry.ttlMs) {
                keysToRemove.push(k);
              }
            } catch {
              keysToRemove.push(k);
            }
          }
        }
      }

      for (const k of keysToRemove) {
        localStorage.removeItem(k);
      }
    } catch {}
  }

  /**
   * Invalida uma chave em todos os níveis.
   */
  public invalidate(key: string): void {
    this.memoryCache.delete(key);
    this.inFlightRequests.delete(key);
    if (this.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(this.getStorageKey(key));
      } catch {}
    }
  }

  /**
   * Limpa todo o cache deste namespace.
   */
  public clear(): void {
    this.memoryCache.clear();
    this.inFlightRequests.clear();
    this.pruneExpiredLocalStorage();
  }
}
