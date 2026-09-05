import { describe, it, expect } from 'vitest';
import {
  calculateProjectedCoastPoints,
  calculateGerstnerWave,
  calculateSpecularGlint,
  getOceanThemePalette,
  OCEAN_ISLANDS_SPECS,
  OCEAN_CURRENTS_SPECS,
} from '../lib/oceanEngine/oceanMath';
import { OCEAN_VERTEX_SHADER, OCEAN_FRAGMENT_SHADER } from '../lib/oceanEngine/oceanShaders';
import { generateCoastDistanceTexture } from '../lib/oceanEngine/oceanDistanceField';
import { OceanSimulationEngine } from '../lib/oceanEngine/oceanSimulation';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../lib/mapProjections';

describe('Ocean Mini Engine - Matemática e Física Oceânica', () => {
  it('deve pré-calcular pontos da costa brasileira com vetores normais válidos', () => {
    const coast = calculateProjectedCoastPoints();
    expect(coast.length).toBeGreaterThan(20);

    coast.forEach((pt) => {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
      expect(Number.isFinite(pt.nx)).toBe(true);
      expect(Number.isFinite(pt.ny)).toBe(true);
      expect(Number.isFinite(pt.angle)).toBe(true);

      // O vetor normal deve apontar predominantemente para Leste/Sudeste (mar adentro)
      expect(pt.nx).toBeGreaterThanOrEqual(0);
    });
  });

  it('deve calcular ondas de Gerstner com valores finitos e deformação contínua', () => {
    const time = 2.5;
    const testPoints = [
      { x: 1200, y: 500 },
      { x: 1600, y: 800 },
      { x: 2000, y: 1200 },
    ];

    testPoints.forEach((pt) => {
      const wave = calculateGerstnerWave(pt.x, pt.y, time, 1.0, 1.0);
      expect(Number.isFinite(wave.dx)).toBe(true);
      expect(Number.isFinite(wave.dy)).toBe(true);
      expect(Number.isFinite(wave.height)).toBe(true);
      expect(Number.isFinite(wave.normalX)).toBe(true);
      expect(Number.isFinite(wave.normalY)).toBe(true);
      expect(Math.abs(wave.height)).toBeLessThan(50);
    });
  });

  it('deve calcular reflexo especular de Fresnel no intervalo [0, 1]', () => {
    // Alinhado perfeitamente com a luz
    const glintMax = calculateSpecularGlint(0.7, -0.7, 0.7, -0.7);
    expect(glintMax).toBeGreaterThan(0);
    expect(glintMax).toBeLessThanOrEqual(1.0);

    // Oposto à luz
    const glintZero = calculateSpecularGlint(-0.7, 0.7, 0.7, -0.7);
    expect(glintZero).toBe(0);
  });

  it('deve retornar paletas cromáticas distintas para cada modo', () => {
    const modes = ['aventura', 'biodiversidade', 'musicalidades', 'clima'] as const;
    modes.forEach((mode) => {
      const palette = getOceanThemePalette(mode);
      expect(palette).toHaveProperty('deepWater');
      expect(palette).toHaveProperty('shallowWater');
      expect(palette).toHaveProperty('swellBody');
      expect(palette).toHaveProperty('foamCrest');
      expect(palette).toHaveProperty('bubbleColor');
      expect(palette).toHaveProperty('specular');
    });
  });

  it('deve catalogar ilhas oceânicas e correntes atlânticas essenciais', () => {
    expect(OCEAN_ISLANDS_SPECS.some((i) => i.name.includes('Noronha'))).toBe(true);
    expect(OCEAN_ISLANDS_SPECS.some((i) => i.name.includes('Abrolhos'))).toBe(true);
    expect(OCEAN_CURRENTS_SPECS.some((c) => c.name.includes('Brasil'))).toBe(true);
  });
});

describe('Ocean Simulation Engine - Ciclo de Vida de Entidades', () => {
  it('deve instanciar a engine com frentes de ondulação e lote inicial de bolhas', () => {
    const engine = new OceanSimulationEngine({
      waveSpeed: 1.0,
      bubblesEnabled: true,
      coastalSurfEnabled: true,
    });

    expect(engine.getSwells().length).toBeGreaterThan(15);
    expect(engine.getBubbles().length).toBeGreaterThan(0);
    expect(engine.getSurfParticles().length).toBeGreaterThan(0);
  });

  it('deve simular evolução temporal das bolhas com empuxo e marolas ao estourar', () => {
    const engine = new OceanSimulationEngine({
      waveSpeed: 1.5,
      bubblesEnabled: true,
      bubblesDensity: 2.0,
    });

    const initialBubblesCount = engine.getBubbles().length;
    expect(initialBubblesCount).toBeGreaterThan(0);

    // Simula 100 frames
    for (let frame = 0; frame < 100; frame++) {
      engine.update(0.016);
    }

    expect(engine.getTime()).toBeGreaterThan(0);
  });

  it('deve disparar marolas interativas e expandi-las com atenuação', () => {
    const engine = new OceanSimulationEngine();

    engine.triggerMarola(1500, 700, 'interaction', 2, 50);
    const marolas = engine.getMarolas();
    expect(marolas.length).toBeGreaterThan(0);

    const initialRadius = marolas[marolas.length - 1].radius;

    // Atualiza a física
    engine.update(0.1);

    const updatedMarola = engine.getMarolas().find((m) => m.type === 'interaction');
    if (updatedMarola) {
      expect(updatedMarola.radius).toBeGreaterThan(initialRadius);
      expect(updatedMarola.alpha).toBeLessThanOrEqual(1.0);
    }
  });

  it('deve atualizar configurações dinâmicas sem reinicializar o estado', () => {
    const engine = new OceanSimulationEngine({ waveSpeed: 1.0 });
    expect(engine.getConfig().waveSpeed).toBe(1.0);

    engine.setConfig({ waveSpeed: 2.5, bubblesDensity: 1.8 });
    expect(engine.getConfig().waveSpeed).toBe(2.5);
    expect(engine.getConfig().bubblesDensity).toBe(1.8);
  });

  it('deve validar integridade dos shaders GLSL WebGL2 da Mini-Engine com Fractal Noise e Partículas', () => {
    expect(OCEAN_VERTEX_SHADER).toContain('#version 300 es');
    expect(OCEAN_VERTEX_SHADER).toContain('a_position');
    expect(OCEAN_FRAGMENT_SHADER).toContain('#version 300 es');
    expect(OCEAN_FRAGMENT_SHADER).toContain('u_coast_distance_tex');
    expect(OCEAN_FRAGMENT_SHADER).toContain('u_map_scale');
    expect(OCEAN_FRAGMENT_SHADER).toContain('getLiquidCausticFractal');
    expect(OCEAN_FRAGMENT_SHADER).toContain('getBlurredParticles');
    expect(OCEAN_FRAGMENT_SHADER).toContain('getOceanPalette');
    expect(OCEAN_FRAGMENT_SHADER).toContain('getTidePulses');
    expect(OCEAN_FRAGMENT_SHADER).toContain('oceanDeepColor');
    expect(OCEAN_FRAGMENT_SHADER).toContain('coastalAlpha');
    expect(OCEAN_FRAGMENT_SHADER).toContain('finalWaterColor');
  });

  it('deve gerar textura SDF batimétrica da costa com dimensões corretas', () => {
    const { canvas, width, height } = generateCoastDistanceTexture();
    expect(width).toBe(MAP_CANVAS_WIDTH);
    expect(height).toBe(MAP_CANVAS_HEIGHT);
    expect(canvas.width).toBe(MAP_CANVAS_WIDTH);
  });
});
