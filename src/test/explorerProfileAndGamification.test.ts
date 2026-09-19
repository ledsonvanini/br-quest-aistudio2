import { describe, it, expect, beforeEach } from 'vitest';
import { loadUserProgress, saveUserProgress, calculateLevel, INITIAL_PROGRESS } from '../lib/storage';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { BRAZIL_STATES_REGISTRY } from '../data/brazilStatesRegistry';
import { STATE_COAT_OF_ARMS } from '../data/coatOfArms';
import { UserProgress } from '../types';

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

describe('Explorer Profile, Gamification & Storage Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Persistência do Progresso do Explorador (storage.ts)', () => {
    it('deve carregar os valores padrão do progresso quando o localStorage estiver limpo', () => {
      const progress = loadUserProgress();
      expect(progress).toBeDefined();
      expect(progress.xp).toBe(0);
      expect(progress.level).toBe(1);
      expect(progress.completedStateIds).toEqual([]);
      expect(progress.unlockedInsigniaIds).toEqual([]);
      expect(progress.unlockedCodexIds.length).toBeGreaterThan(0);
    });

    it('deve salvar e carregar o progresso do usuário no localStorage e na chave de backup', () => {
      const customProgress: UserProgress = {
        ...INITIAL_PROGRESS,
        xp: 450,
        level: 3,
        completedStateIds: ['SP', 'RJ', 'MG'],
        unlockedInsigniaIds: ['insignia_sp', 'insignia_rj'],
        dailyStreak: 5,
        totalCorrectAnswers: 12,
        totalQuestsPlayed: 15,
      };

      saveUserProgress(customProgress);

      const loaded = loadUserProgress();
      expect(loaded.xp).toBe(450);
      expect(loaded.level).toBe(3);
      expect(loaded.completedStateIds).toEqual(['SP', 'RJ', 'MG']);
      expect(loaded.unlockedInsigniaIds).toEqual(['insignia_sp', 'insignia_rj']);
      expect(loaded.dailyStreak).toBe(5);
      expect(loaded.totalCorrectAnswers).toBe(12);
      expect(loaded.totalQuestsPlayed).toBe(15);
    });

    it('deve usar o backup de segurança caso a chave principal falhe', () => {
      const backupProgress: UserProgress = {
        ...INITIAL_PROGRESS,
        xp: 900,
        level: 4,
        completedStateIds: ['AM', 'PA'],
      };

      localStorage.setItem('simbolos_br_progress_rpg_backup_v2', JSON.stringify(backupProgress));

      const loaded = loadUserProgress();
      expect(loaded.xp).toBe(900);
      expect(loaded.level).toBe(4);
      expect(loaded.completedStateIds).toEqual(['AM', 'PA']);
    });
  });

  describe('2. Algoritmo de Cálculo de Níveis e Títulos Honoríficos', () => {
    it('deve calcular corretamente Nível 1 para 0 XP', () => {
      const info = calculateLevel(0);
      expect(info.level).toBe(1);
      expect(info.currentXpInLevel).toBe(0);
      expect(info.titlePt).toBe('Recruta da Pátria');
    });

    it('deve evoluir de nível conforme o XP acumulado aumenta', () => {
      const lvl1 = calculateLevel(50);
      expect(lvl1.level).toBe(1);

      const lvl2 = calculateLevel(200);
      expect(lvl2.level).toBe(2);

      const lvlHigh = calculateLevel(5000);
      expect(lvlHigh.level).toBeGreaterThanOrEqual(8);
      expect(lvlHigh.titlePt).toBeTruthy();
    });
  });

  describe('3. Integridade dos Guardiões das 27 Unidades Federativas', () => {
    const allStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
    ];

    it('deve garantir que todos os 27 estados possuem guardião configurado', () => {
      expect(GUARDIANS_DATA.length).toBe(27);

      allStates.forEach((stateId) => {
        const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
        expect(guardian).toBeDefined();
        expect(guardian?.id).toBe(stateId);
        expect(guardian?.guardianName).toBeTruthy();
        expect(guardian?.questions).toBeDefined();
        expect(guardian?.questions.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('deve verificar que cada pergunta do quiz tem 4 alternativas e uma resposta correta válida', () => {
      GUARDIANS_DATA.forEach((guardian) => {
        guardian.questions.forEach((q) => {
          expect(q.optionsPt.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
        });
      });
    });

    it('deve garantir que todos os 27 estados possuem dados cadastrais no registro oficial e brasão oficial', () => {
      allStates.forEach((stateId) => {
        const stateInfo = BRAZIL_STATES_REGISTRY[stateId];
        expect(stateInfo).toBeDefined();
        expect(stateInfo.name).toBeTruthy();
        expect(stateInfo.capital).toBeTruthy();
        expect(stateInfo.region).toBeTruthy();

        const coatOfArms = STATE_COAT_OF_ARMS[stateId];
        expect(coatOfArms).toBeDefined();
        expect(typeof coatOfArms).toBe('string');
      });
    });
  });
});
