import { describe, it, expect } from 'vitest';
import {
  STATE_GEOGRAPHICAL_DATA,
  REGION_COLORS,
  BIOME_COLORS,
  getStateColor,
} from '../lib/mapColorScales';

describe('Escalas de Cores, Temas e Dados Geográficos dos Estados', () => {
  it('deve possuir metadados geográficos para todos os 27 estados', () => {
    const stateKeys = Object.keys(STATE_GEOGRAPHICAL_DATA);
    expect(stateKeys.length).toBe(27);

    stateKeys.forEach((key) => {
      const info = STATE_GEOGRAPHICAL_DATA[key];
      expect(info.id).toBe(key);
      expect(info.name).toBeTruthy();
      expect(info.region).toBeTruthy();
      expect(info.biome).toBeTruthy();
      expect(info.elevationCategory).toBeTruthy();
    });
  });

  it('deve retornar cores válidas para as 5 regiões do IBGE', () => {
    const regions = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
    regions.forEach((r) => {
      const color = REGION_COLORS[r];
      expect(color).toBeDefined();
      expect(color.fill.startsWith('#')).toBe(true);
      expect(color.stroke.startsWith('#')).toBe(true);
    });
  });

  it('deve retornar cores válidas para os 6 biomas brasileiros', () => {
    const biomes = ['Amazônia', 'Cerrado', 'Caatinga', 'Mata Atlântica', 'Pantanal', 'Pampa'];
    biomes.forEach((b) => {
      const biome = BIOME_COLORS[b];
      expect(biome).toBeDefined();
      expect(biome.fill.startsWith('#')).toBe(true);
      expect(biome.stroke.startsWith('#')).toBe(true);
    });
  });

  it('deve calcular corretamente a cor do estado em diferentes modos', () => {
    // Modo Tiles
    const tileColor = getStateColor('SP', 'tiles', 'regions', false, false, false);
    expect(tileColor.fill).toBeTruthy();
    expect(tileColor.stroke).toBeTruthy();

    // Modo Coroplético por Região
    const regionColor = getStateColor('AM', 'choropleth', 'regions', false, false, false);
    expect(regionColor.fill).toBe(REGION_COLORS['Norte'].fill);

    // Modo Coroplético por Bioma
    const biomeColor = getStateColor('RS', 'choropleth', 'biomes', false, false, false);
    expect(biomeColor.fill).toBe(BIOME_COLORS['Pampa'].fill);

    // Estado Concluído em Progresso
    const completedColor = getStateColor('BA', 'choropleth', 'progress', true, false, false);
    expect(completedColor.fill).toBe('#194d33');

    // Estado Selecionado (Hover / Ativo)
    const selectedColor = getStateColor('RJ', 'tiles', 'progress', false, false, true);
    expect(selectedColor.stroke).toBe('#fbbf24'); // Borda dourada
  });
});
