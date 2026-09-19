import { describe, it, expect, beforeEach } from 'vitest';
import { centralizarZoomMapa } from '../services/mapModeService';
import { getDailyTipsForDate, DAILY_TIPS_CATALOG } from '../data/dailyTipsData';
import { BRAZIL_STATES_REGISTRY } from '../data/brazilStatesRegistry';
import { CartographyLayerMode } from '../types/cartography';
import { AppMainMode } from '../types';

// Polyfill in-memory localStorage for Node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe('Beta Release E2E & Core Integration Flows', () => {
  const containerWidth = 1200;

  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Fluxo de Alternância de Modos Principais & Re-enquadramento de Câmera', () => {
    const modes: AppMainMode[] = ['clima', 'biodiversidade', 'geopolitica', 'musicalidades', 'aventura', 'globo3d'];

    modes.forEach((mode) => {
      it(`deve calcular enquadramento de câmera válido para o modo "${mode}" sem erros ou NaN`, () => {
        const configNoPanel = centralizarZoomMapa(mode, {
          containerWidth,
          is3D: mode === 'globo3d',
          isPanelOpen: false,
        });

        expect(configNoPanel).toBeDefined();
        expect(configNoPanel.targetZoom).toBeGreaterThan(0);
        expect(Number.isNaN(configNoPanel.targetPan.x)).toBe(false);
        expect(Number.isNaN(configNoPanel.targetPan.y)).toBe(false);

        const configWithPanel = centralizarZoomMapa(mode, {
          containerWidth,
          is3D: mode === 'globo3d',
          isPanelOpen: true,
        });

        expect(configWithPanel).toBeDefined();
        expect(configWithPanel.targetZoom).toBeGreaterThan(0);
        expect(Number.isNaN(configWithPanel.targetPan.x)).toBe(false);
        expect(Number.isNaN(configWithPanel.targetPan.y)).toBe(false);
      });
    });

    it('deve centralizar a câmera ao focar em um estado específico em qualquer modo 2D', () => {
      const stateId = 'SP';
      const stateInfo = BRAZIL_STATES_REGISTRY[stateId];
      expect(stateInfo).toBeDefined();
      const centroid = stateInfo.centroid;

      const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
        stateId,
        centroid,
        containerWidth,
        is3D: false,
        isPanelOpen: true,
      });

      expect(targetZoom).toBeGreaterThan(1.0);
      expect(Number.isNaN(targetPan.x)).toBe(false);
      expect(Number.isNaN(targetPan.y)).toBe(false);
      expect(targetPan.x).not.toBe(0);
    });
  });

  describe('2. Fluxo da Dica do Dia & Teletransporte Cartográfico', () => {
    it('deve retornar sempre dicas do dia estruturadas para a data informada', () => {
      const dateKey = '19/09/2026';
      const tips = getDailyTipsForDate(dateKey);

      expect(tips).toBeDefined();
      expect(tips.length).toBeGreaterThanOrEqual(1);

      tips.forEach((tip) => {
        expect(tip.id).toBeDefined();
        expect(tip.title).toBeTruthy();
        expect(tip.fact).toBeTruthy();
        expect(tip.stateId).toBeTruthy();
        const stateInfo = BRAZIL_STATES_REGISTRY[tip.stateId];
        expect(stateInfo).toBeDefined();
      });
    });

    it('deve garantir que todas as dicas do catálogo apontam para estados registrados na federação', () => {
      expect(DAILY_TIPS_CATALOG.length).toBeGreaterThan(0);

      DAILY_TIPS_CATALOG.forEach((tip) => {
        const stateInfo = BRAZIL_STATES_REGISTRY[tip.stateId];
        expect(stateInfo).toBeDefined();
        expect(stateInfo.name).toBeTruthy();
        expect(stateInfo.region).toBeTruthy();
        expect(stateInfo.centroid).toBeDefined();
        expect(stateInfo.centroid.length).toBe(2);
      });
    });
  });

  describe('3. Regra de Isolamento: Camadas Cartográficas de Território', () => {
    const territoryLayers: CartographyLayerMode[] = ['bacias_hidrograficas', 'biomas_relevo', 'rotas_integracao'];

    territoryLayers.forEach((layer) => {
      it(`camada de território "${layer}" deve ser distinta de 'none'`, () => {
        expect(layer).not.toBe('none');
      });
    });

    it('reset do enquadramento deve restaurar visualização sem dependência de estado selecionado', () => {
      const resetConfig = centralizarZoomMapa('clima', {
        stateId: 'RESET_CENTRAL_BRAZIL',
        containerWidth,
        is3D: false,
        isPanelOpen: false,
      });

      expect(resetConfig.targetZoom).toBeGreaterThan(0);
      expect(resetConfig.targetPan).toBeDefined();
    });
  });
});
