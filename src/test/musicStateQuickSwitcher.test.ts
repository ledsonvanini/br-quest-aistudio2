import { describe, it, expect, vi } from 'vitest';
import { ALL_BRAZIL_STATES } from '../components/music/MusicStateQuickSwitcher';

describe('MusicStateQuickSwitcher & Musicalities Lateral App', () => {
  it('deve conter todos os 27 estados da federação brasileira', () => {
    expect(ALL_BRAZIL_STATES).toHaveLength(27);

    const ufs = ALL_BRAZIL_STATES.map((s) => s.id);
    expect(ufs).toContain('SP');
    expect(ufs).toContain('RJ');
    expect(ufs).toContain('BA');
    expect(ufs).toContain('RS');
    expect(ufs).toContain('AM');
    expect(ufs).toContain('DF');
    expect(ufs).toContain('MG');
  });

  it('deve associar cada estado à sua respectiva macro-região oficial', () => {
    const sp = ALL_BRAZIL_STATES.find((s) => s.id === 'SP');
    expect(sp?.region).toBe('Sudeste');

    const ba = ALL_BRAZIL_STATES.find((s) => s.id === 'BA');
    expect(ba?.region).toBe('Nordeste');

    const am = ALL_BRAZIL_STATES.find((s) => s.id === 'AM');
    expect(am?.region).toBe('Norte');

    const rs = ALL_BRAZIL_STATES.find((s) => s.id === 'RS');
    expect(rs?.region).toBe('Sul');

    const go = ALL_BRAZIL_STATES.find((s) => s.id === 'GO');
    expect(go?.region).toBe('Centro-Oeste');
  });

  it('deve permitir navegação cíclica entre os estados', () => {
    const total = ALL_BRAZIL_STATES.length;
    const currentIndex = 0; // AC
    const prevIndex = (currentIndex - 1 + total) % total;
    expect(ALL_BRAZIL_STATES[prevIndex].id).toBe('TO');

    const nextIndex = (currentIndex + 1) % total;
    expect(ALL_BRAZIL_STATES[nextIndex].id).toBe('AL');
  });
});
