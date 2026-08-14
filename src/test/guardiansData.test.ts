import { describe, it, expect } from 'vitest';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { STATE_COAT_OF_ARMS } from '../data/coatOfArms';

describe('Integridade dos Dados dos 27 Estados e Guardiões RPG', () => {
  it('deve conter exatamente 27 estados cadastrados', () => {
    expect(GUARDIANS_DATA.length).toBe(27);
  });

  it('todos os 27 estados devem ter guardião completo com perguntas e conteúdo bilíngue', () => {
    GUARDIANS_DATA.forEach(guardian => {
      expect(guardian.id, 'ID do estado inválido').toBeTruthy();
      expect(guardian.stateNamePt, `Nome PT faltando em ${guardian.id}`).toBeTruthy();
      expect(guardian.guardianName, `Nome do Guardião faltando em ${guardian.id}`).toBeTruthy();
      expect(guardian.guardianTitlePt, `Título do Guardião faltando em ${guardian.id}`).toBeTruthy();
      expect(guardian.questions.length, `Perguntas de quiz faltando em ${guardian.id}`).toBeGreaterThan(0);
      
      // Cada pergunta de quiz deve ter 4 opções e índice de resposta correto
      guardian.questions.forEach((q, idx) => {
        expect(q.optionsPt.length, `Quiz ${idx} de ${guardian.id} deve ter 4 opções em PT`).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
      });
    });
  });

  it('todos os estados devem ter brasão oficial mapeado em coatOfArms', () => {
    GUARDIANS_DATA.forEach(guardian => {
      const coatOfArms = STATE_COAT_OF_ARMS[guardian.id];
      expect(coatOfArms, `Brasão do estado ${guardian.id} não mapeado`).toBeDefined();
      expect(typeof coatOfArms).toBe('string');
      expect(coatOfArms.length).toBeGreaterThan(0);
    });
  });
});
