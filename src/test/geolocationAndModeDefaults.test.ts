import { describe, it, expect } from 'vitest';
import {
  BRAZIL_STATE_LAT_LNG,
  STATE_NAME_TO_UF,
  normalizeStateId,
  getStateDefaultBiome,
} from '../services/geolocationService';

describe('Geolocation & Normalization Engine', () => {
  it('contains complete, accurate definitions for all 27 federative units of Brazil', () => {
    const states = Object.keys(BRAZIL_STATE_LAT_LNG);
    expect(states).toHaveLength(27);

    // Verify all 5 regions are represented
    const regions = new Set(Object.values(BRAZIL_STATE_LAT_LNG).map((s) => s.regionId));
    expect(regions.has('norte')).toBe(true);
    expect(regions.has('nordeste')).toBe(true);
    expect(regions.has('centro_oeste')).toBe(true);
    expect(regions.has('sudeste')).toBe(true);
    expect(regions.has('sul')).toBe(true);

    // Verify coordinate bounding box for Brazil
    Object.values(BRAZIL_STATE_LAT_LNG).forEach((s) => {
      expect(s.lat).toBeGreaterThanOrEqual(-34);
      expect(s.lat).toBeLessThanOrEqual(6);
      expect(s.lng).toBeGreaterThanOrEqual(-74);
      expect(s.lng).toBeLessThanOrEqual(-34);
      expect(s.name.length).toBeGreaterThan(0);
    });
  });

  describe('normalizeStateId - High-Precision Fuzzy & Strict Matching', () => {
    it('normalizes 2-letter uppercase and lowercase UF codes', () => {
      expect(normalizeStateId('SP')).toBe('SP');
      expect(normalizeStateId('sp')).toBe('SP');
      expect(normalizeStateId('rj')).toBe('RJ');
      expect(normalizeStateId('df')).toBe('DF');
      expect(normalizeStateId('am')).toBe('AM');
      expect(normalizeStateId('rs')).toBe('RS');
    });

    it('normalizes ISO / GeoJSON prefixes like BR-SP or BR_AM', () => {
      expect(normalizeStateId('BR-SP')).toBe('SP');
      expect(normalizeStateId('BR_MG')).toBe('MG');
      expect(normalizeStateId('BRRS')).toBe('RS');
      expect(normalizeStateId('br-ba')).toBe('BA');
    });

    it('normalizes full state names with or without diacritics / accents', () => {
      expect(normalizeStateId('São Paulo')).toBe('SP');
      expect(normalizeStateId('Sao Paulo')).toBe('SP');
      expect(normalizeStateId('sao paulo')).toBe('SP');
      expect(normalizeStateId('Maranhão')).toBe('MA');
      expect(normalizeStateId('Maranhao')).toBe('MA');
      expect(normalizeStateId('Ceará')).toBe('CE');
      expect(normalizeStateId('Goias')).toBe('GO');
      expect(normalizeStateId('Goiás')).toBe('GO');
      expect(normalizeStateId('Pará')).toBe('PA');
      expect(normalizeStateId('Para')).toBe('PA');
      expect(normalizeStateId('Amapá')).toBe('AP');
      expect(normalizeStateId('Rondônia')).toBe('RO');
      expect(normalizeStateId('Rio Grande do Sul')).toBe('RS');
      expect(normalizeStateId('Minas Gerais')).toBe('MG');
      expect(normalizeStateId('Distrito Federal')).toBe('DF');
      expect(normalizeStateId('Brasília')).toBe('DF');
      expect(normalizeStateId('Brasilia')).toBe('DF');
    });

    it('returns null for empty or invalid strings', () => {
      expect(normalizeStateId('')).toBeNull();
      expect(normalizeStateId('xyz123')).toBeNull();
    });
  });

  describe('getStateDefaultBiome - Predominant Biome Resolution', () => {
    it('resolves correct biome for Northern states (Amazônia)', () => {
      expect(getStateDefaultBiome('AM')).toBe('Amazônia');
      expect(getStateDefaultBiome('PA')).toBe('Amazônia');
      expect(getStateDefaultBiome('AC')).toBe('Amazônia');
      expect(getStateDefaultBiome('RO')).toBe('Amazônia');
      expect(getStateDefaultBiome('RR')).toBe('Amazônia');
      expect(getStateDefaultBiome('AP')).toBe('Amazônia');
    });

    it('resolves correct biome for Northeastern states (Caatinga)', () => {
      expect(getStateDefaultBiome('CE')).toBe('Caatinga');
      expect(getStateDefaultBiome('RN')).toBe('Caatinga');
      expect(getStateDefaultBiome('PB')).toBe('Caatinga');
      expect(getStateDefaultBiome('PE')).toBe('Caatinga');
      expect(getStateDefaultBiome('AL')).toBe('Caatinga');
      expect(getStateDefaultBiome('SE')).toBe('Caatinga');
      expect(getStateDefaultBiome('BA')).toBe('Caatinga');
      expect(getStateDefaultBiome('PI')).toBe('Caatinga');
    });

    it('resolves correct biome for Central-West states (Cerrado & Pantanal)', () => {
      expect(getStateDefaultBiome('DF')).toBe('Cerrado');
      expect(getStateDefaultBiome('GO')).toBe('Cerrado');
      expect(getStateDefaultBiome('TO')).toBe('Cerrado');
      expect(getStateDefaultBiome('MT')).toBe('Cerrado');
      expect(getStateDefaultBiome('MS')).toBe('Pantanal');
    });

    it('resolves correct biome for Southern states (Pampa / Mata Atlântica)', () => {
      expect(getStateDefaultBiome('RS')).toBe('Pampa');
      expect(getStateDefaultBiome('PR')).toBe('Mata Atlântica');
      expect(getStateDefaultBiome('SC')).toBe('Mata Atlântica');
    });

    it('resolves correct biome for Southeastern states (Mata Atlântica)', () => {
      expect(getStateDefaultBiome('SP')).toBe('Mata Atlântica');
      expect(getStateDefaultBiome('RJ')).toBe('Mata Atlântica');
      expect(getStateDefaultBiome('MG')).toBe('Mata Atlântica');
      expect(getStateDefaultBiome('ES')).toBe('Mata Atlântica');
    });
  });
});
