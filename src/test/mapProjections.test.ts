import { describe, it, expect } from 'vitest';
import {
  createBrazilMercatorProjection,
  createNauticalGraticule,
  calculateCalibratedCentroids,
  clampPanZoom,
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
  DEFAULT_BRAZIL_ZOOM,
  NEIGHBORS_CONTINENT_ZOOM,
  getParameterizedMapCentering,
  getMusicalFocusZoomAndPan,
} from '../lib/mapProjections';
import { geoPath } from 'd3-geo';

describe('Motor de Projeção Cartográfica D3 e Clamping Anti-Vazio', () => {
  it('deve instanciar uma projeção Mercator calibrada com dimensões válidas', () => {
    const proj = createBrazilMercatorProjection();
    expect(proj).toBeDefined();

    // Brasília coordinates (-47.9292, -15.7801)
    const [bx, by] = proj([-47.9292, -15.7801]) || [0, 0];
    expect(bx).toBeGreaterThan(0);
    expect(bx).toBeLessThan(MAP_CANVAS_WIDTH);
    expect(by).toBeGreaterThan(0);
    expect(by).toBeLessThan(MAP_CANVAS_HEIGHT);
  });

  it('deve gerar a malha de linhas náuticas (graticule) D3', () => {
    const graticule = createNauticalGraticule();
    expect(graticule).toBeDefined();
    expect(graticule.type).toBe('MultiLineString');
    expect(graticule.coordinates.length).toBeGreaterThan(0);
  });

  it('deve calcular centróides de estados sem gerar valores NaN', () => {
    const proj = createBrazilMercatorProjection();
    const pathGen = geoPath().projection(proj);

    const mockFeatures = [
      {
        properties: { id: 'BRSP', name: 'São Paulo' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.63, -23.55],
              [-47.0, -23.0],
              [-46.0, -23.0],
              [-46.63, -23.55],
            ],
          ],
        },
      },
      {
        properties: { id: 'BRDF', name: 'Distrito Federal' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-47.9, -15.7],
              [-48.0, -15.8],
              [-47.8, -15.8],
              [-47.9, -15.7],
            ],
          ],
        },
      },
    ];

    const centroids = calculateCalibratedCentroids(mockFeatures as any, pathGen as any);
    expect(centroids['SP']).toBeDefined();
    expect(isNaN(centroids['SP'][0])).toBe(false);
    expect(isNaN(centroids['SP'][1])).toBe(false);
    expect(centroids['DF']).toBeDefined();
  });

  it('deve travar os limites de pan e zoom evitando que a tela fique vazia (Zero-Void)', () => {
    const container = { width: 1280, height: 720 };

    // Tentativa de arrastar muito além do limite para a direita (+5000px)
    const result1 = clampPanZoom({ x: 5000, y: -4000 }, 1.0, container, 0.85, 3.5);
    expect(result1.zoom).toBe(1.0);
    expect(result1.pan.x).toBeLessThan(5000);
    expect(result1.pan.y).toBeGreaterThan(-4000);

    // Tentativa de zoom abaixo de 0.85 (zoom out excessivo gerando vazio)
    const result2 = clampPanZoom({ x: 0, y: 0 }, 0.2, container, 0.85, 3.5);
    expect(result2.zoom).toBe(0.85); // Clamped to minZoom 0.85

    // Tentativa de zoom acima do máximo suportado
    const result3 = clampPanZoom({ x: 0, y: 0 }, 10.0, container, 0.85, 3.5);
    expect(result3.zoom).toBe(3.5); // Clamped to maxZoom 3.5
  });

  it('deve reconhecer o novo padrão de zoom out aumentado em 20% na função Centralizar Mapa', () => {
    expect(DEFAULT_BRAZIL_ZOOM).toBe(0.95);
    expect(NEIGHBORS_CONTINENT_ZOOM).toBe(0.57);

    // Cenário padrão: Centralizar Mapa
    const centerDefault = getParameterizedMapCentering({
      scenario: 'Centralizar Mapa',
      containerWidth: 1920,
      containerHeight: 1080,
      is3D: true,
    });
    expect(centerDefault.targetZoom).toBe(0.95);
    expect(isNaN(centerDefault.targetPan.x)).toBe(false);
    expect(isNaN(centerDefault.targetPan.y)).toBe(false);

    // Cenário: Centralizar Mapa mostrar Vizinhos
    const centerNeighbors = getParameterizedMapCentering({
      scenario: 'Centralizar Mapa mostrar Vizinhos',
      containerWidth: 1920,
      containerHeight: 1080,
      is3D: true,
    });
    expect(centerNeighbors.targetZoom).toBe(0.57);
    expect(isNaN(centerNeighbors.targetPan.x)).toBe(false);
    expect(isNaN(centerNeighbors.targetPan.y)).toBe(false);
  });

  it('deve calcular pan e zoom para Musicalidades com offset de 50% de tela restante', () => {
    // Para tela desktop (1920px de largura)
    const resultDesktop = getMusicalFocusZoomAndPan([1280, 720], 1920, true, true, 'SP');
    expect(resultDesktop.targetZoom).toBeGreaterThan(1.0);
    // Como o AppLateral fica à direita, o pan.x deve ser deslocado para a esquerda (negativo)
    expect(resultDesktop.targetPan.x).toBeLessThan(0);

    // Para tela mobile (<640px de largura), modal ocupa tela cheia, offset = 0
    const resultMobile = getMusicalFocusZoomAndPan([1280, 720], 480, true, true, 'SP');
    expect(resultMobile.targetPan.x).toBe(0);
  });
});
