import { describe, it, expect } from 'vitest';
import { normalizeStateId } from '../services/geolocationService';

describe('BrQuest Edu & Sidebar Search Polish Tests', () => {
  it('ensures normalizeStateId performs exact matching without false positives', () => {
    // Pará should NOT match Paraná
    expect(normalizeStateId('Pará')).toBe('PA');
    expect(normalizeStateId('Parana')).toBe('PR');
    expect(normalizeStateId('Paraná')).toBe('PR');
    expect(normalizeStateId('São Paulo')).toBe('SP');
    expect(normalizeStateId('Rio de Janeiro')).toBe('RJ');
    expect(normalizeStateId('Rio Grande do Sul')).toBe('RS');
    expect(normalizeStateId('Rio Grande do Norte')).toBe('RN');
    expect(normalizeStateId('Mato Grosso')).toBe('MT');
    expect(normalizeStateId('Mato Grosso do Sul')).toBe('MS');
  });

  it('ensures unknown states return null rather than hardcoded "Norte"', () => {
    expect(normalizeStateId('Estado Inexistente')).toBeNull();
    expect(normalizeStateId('')).toBeNull();
  });
});
