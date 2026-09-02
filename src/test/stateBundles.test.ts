import { describe, it, expect } from 'vitest';
import { ALL_STATE_BUNDLES, ALL_STATES_LIST, getStateBundle } from '../data/states';

describe('Arquitetura Modular de Estados (/src/data/states/)', () => {
  it('deve conter exatamente 27 estados na listagem unificada', () => {
    expect(ALL_STATES_LIST.length).toBe(27);
    expect(Object.keys(ALL_STATE_BUNDLES).length).toBe(27);
  });

  it('todos os 27 estados devem carregar bundle com info, guardião e dados integrados', () => {
    const ufs = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    ufs.forEach((uf) => {
      const state = getStateBundle(uf);
      expect(state, `Estado ${uf} deve existir`).toBeDefined();
      expect(state?.uf).toBe(uf);
      expect(state?.info.name).toBeTruthy();
      expect(state?.info.flagUrl).toBeTruthy();
      expect(state?.guardian.guardianName).toBeTruthy();
      expect(state?.geopolitics?.stateId).toBe(uf);
      expect(state?.climatology?.id).toBe(uf);
      expect(state?.biodiversity?.stateId).toBe(uf);
    });
  });
});
