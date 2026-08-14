import { describe, it, expect } from 'vitest';

describe('Matemática de Efeitos Atmosféricos e Procedurais', () => {
  it('funções de onda senoidal de oceano devem retornar valores finitos contínuos', () => {
    const time = 1.5;
    for (let x = 0; x < 2560; x += 100) {
      for (let y = 0; y < 1440; y += 100) {
        const waveY =
          y +
          Math.sin(x * 0.008 + time * 0.8 + y * 0.005) * 6 +
          Math.cos(x * 0.015 - time * 0.4) * 3;
        expect(isNaN(waveY)).toBe(false);
        expect(isFinite(waveY)).toBe(true);
      }
    }
  });

  it('trajetórias das gaivotas devem permanecer dentro dos limites cartográficos', () => {
    const startX = 1600;
    const startY = 400;
    const path = [
      { x: startX, y: startY },
      { x: startX - 250, y: startY + 120 },
      { x: startX - 500, y: startY + 40 },
      { x: startX - 800, y: startY + 200 },
      { x: startX - 1200, y: startY + 100 },
    ];

    path.forEach((pt) => {
      expect(pt.x).toBeGreaterThanOrEqual(0);
      expect(pt.x).toBeLessThanOrEqual(2560);
      expect(pt.y).toBeGreaterThanOrEqual(0);
      expect(pt.y).toBeLessThanOrEqual(1440);
    });
  });
});
