import { describe, it, expect } from 'vitest';
import { getRouteStateStyle, LOGISTIC_CORRIDOR_STATE_COLORS } from '../components/map/stateStyling/routesStateColors';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../data/cartographyBasinsData';

describe('Módulo Território & Redes Vivas - Isolamento e Paleta de Cores Temáticas', () => {
  it('deve fornecer estilo de cores temáticas para estados do corredor Agro-Exportador (MT)', () => {
    const style = getRouteStateStyle('MT', false, false);
    expect(style.stateFill).toBe('#451a03'); // Dourado Agro
    expect(style.underglowColor).toBe('#fbbf24');
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.MT.axisName).toContain('BR-163');
  });

  it('deve fornecer estilo de cores temáticas para estados de Portos e Cabotagem (SP)', () => {
    const style = getRouteStateStyle('SP', false, false);
    expect(style.stateFill).toBe('#082f49'); // Hub Portuário / Azul Marinho
    expect(style.strokeColor).toBe('#38bdf8');
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.SP.axisName).toContain('Santos');
  });

  it('deve fornecer estilo de cores temáticas para estados da Hidrovia Amazônica (AM)', () => {
    const style = getRouteStateStyle('AM', false, false);
    expect(style.stateFill).toBe('#064e3b'); // Verde Florestal Navegável
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.AM.axisName).toContain('Solimões-Amazonas');
  });

  it('deve ter todos os 27 estados mapeados nos dados de hidrologia e bacias', () => {
    const expectedStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
    ];

    expectedStates.forEach((uf) => {
      const detail = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[uf];
      expect(detail).toBeDefined();
      expect(detail.basinName).toBeTruthy();
      expect(detail.mainRivers.length).toBeGreaterThan(0);
      expect(detail.routes.length).toBeGreaterThan(0);
    });
  });

  it('deve ter mapeamento de rotas para todos os estados em LOGISTIC_CORRIDOR_STATE_COLORS', () => {
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.MT).toBeDefined();
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.SP).toBeDefined();
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.AM).toBeDefined();
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.BA).toBeDefined();
    expect(LOGISTIC_CORRIDOR_STATE_COLORS.RS).toBeDefined();
  });
});

