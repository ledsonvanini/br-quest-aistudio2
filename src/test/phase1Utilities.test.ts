import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MultiTierCache } from '../lib/cacheEngine';
import {
  formatNumber,
  formatPopulation,
  formatCurrencyBRL,
  formatPercent,
  formatTemperature,
  formatWindSpeed,
  formatCoordinates,
  truncateText,
} from '../lib/formatters';
import {
  lerp,
  clamp,
  distance2D,
  degToRad,
  radToDeg,
  rotatePoint2D,
  projectIsometric,
  calculateCentroid,
} from '../lib/geoTransforms';

describe('Fase 1: MultiTierCache', () => {
  let cache: MultiTierCache<string>;

  beforeEach(() => {
    cache = new MultiTierCache<string>({
      namespace: 'test_cache',
      defaultTtlMs: 1000,
      enableLocalStorage: false, // testa em memória
    });
  });

  it('armazena e recupera valores em memória L1', () => {
    cache.set('chave_teste', 'valor_teste');
    expect(cache.get('chave_teste')).toBe('valor_teste');
    expect(cache.get('inexistente')).toBeNull();
  });

  it('respeita expiração por TTL', async () => {
    cache.set('rapido', 'dado', 20); // 20ms TTL
    expect(cache.get('rapido')).toBe('dado');
    await new Promise((res) => setTimeout(res, 30));
    expect(cache.get('rapido')).toBeNull();
  });

  it('deduplica chamadas em voo concorrentes via getOrFetch', async () => {
    let executionCount = 0;
    const slowFetcher = async () => {
      executionCount++;
      await new Promise((res) => setTimeout(res, 50));
      return 'resultado_unico';
    };

    // 3 chamadas concorrentes
    const [p1, p2, p3] = await Promise.all([
      cache.getOrFetch('mesma_chave', slowFetcher),
      cache.getOrFetch('mesma_chave', slowFetcher),
      cache.getOrFetch('mesma_chave', slowFetcher),
    ]);

    expect(p1).toBe('resultado_unico');
    expect(p2).toBe('resultado_unico');
    expect(p3).toBe('resultado_unico');
    expect(executionCount).toBe(1); // Executou apenas uma única vez!
  });
});

describe('Fase 1: Formatters', () => {
  it('formata números e populações corretamente', () => {
    expect(formatNumber(1234567)).toBe('1.234.567');
    expect(formatPopulation(44400000)).toContain('44,4 mi hab.');
    expect(formatPopulation(850000)).toContain('850 mil hab.');
  });

  it('formata moedas e percentuais', () => {
    expect(formatCurrencyBRL(100)).toContain('100,00');
    expect(formatPercent(42.56, 1)).toBe('42,6%');
  });

  it('formata temperatura e vento', () => {
    expect(formatTemperature(27.4)).toBe('27°C');
    expect(formatTemperature(null)).toBe('--');
    expect(formatWindSpeed(18.2)).toBe('18 km/h');
  });

  it('formata coordenadas e trunca textos', () => {
    const coords = formatCoordinates(-15.79, -47.88);
    expect(coords).toContain('S');
    expect(coords).toContain('O');
    expect(truncateText('O Brasil é lindo e gigante', 15)).toBe('O Brasil é...');
  });
});

describe('Fase 1: GeoTransforms', () => {
  it('calcula clamp e lerp com precisão', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(lerp(0, 100, 0.5)).toBe(50);
  });

  it('calcula distâncias e conversões angulares', () => {
    expect(distance2D({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(radToDeg(degToRad(180))).toBeCloseTo(180);
  });

  it('calcula rotação 2D e centroide', () => {
    const rotated = rotatePoint2D({ x: 10, y: 0 }, { x: 0, y: 0 }, 90);
    expect(rotated.x).toBeCloseTo(0);
    expect(rotated.y).toBeCloseTo(10);

    const centroid = calculateCentroid([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ]);
    expect(centroid.x).toBe(5);
    expect(centroid.y).toBeCloseTo(3.333, 2);
  });
});
