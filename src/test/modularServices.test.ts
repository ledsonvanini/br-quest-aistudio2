import { describe, it, expect } from 'vitest';
import {
  BRAZIL_STATES_COORDINATES,
  ECMWF_TEMP_COLOR_STOPS,
  getEcmwfTempColor,
  getRainRadarColor,
  generateOfflineCalibratedClimateData,
  formatBrasiliaTimeDynamic,
  formatFullDayTime,
} from '../services/climateService';
import {
  getOptimizedBiodiversityImageUrl,
  getScientificImageSync,
} from '../services/biodiversityImageService';
import { apiTracker } from '../services/apiTracker';

describe('Modular Climate Service & Fallback Architecture', () => {
  it('covers all 27 Brazilian federative units with valid coordinates', () => {
    expect(BRAZIL_STATES_COORDINATES).toHaveLength(27);
    const ufs = new Set(BRAZIL_STATES_COORDINATES.map((s) => s.id));
    expect(ufs.size).toBe(27);
    expect(ufs.has('SP')).toBe(true);
    expect(ufs.has('AM')).toBe(true);
    expect(ufs.has('DF')).toBe(true);
    expect(ufs.has('RS')).toBe(true);
  });

  it('provides complete ECMWF temperature color stops and classification', () => {
    expect(ECMWF_TEMP_COLOR_STOPS.length).toBeGreaterThanOrEqual(10);
    
    // Cold extreme
    const cold = getEcmwfTempColor(-3);
    expect(cold.hex).toBe('#bae6fd');
    
    // Mild
    const mild = getEcmwfTempColor(20);
    expect(mild.hex).toBe('#a3e635');
    
    // Hot
    const hot = getEcmwfTempColor(35);
    expect(hot.hex).toBe('#dc2626');

    // Extreme
    const extreme = getEcmwfTempColor(42);
    expect(extreme.hex).toBe('#991b1b');
  });

  it('correctly maps precipitation amounts to radar colors', () => {
    expect(getRainRadarColor(0)).toBe('transparent');
    expect(getRainRadarColor(0.5)).toBe('#38bdf8');
    expect(getRainRadarColor(5.0)).toBe('#16a34a');
    expect(getRainRadarColor(35.0)).toBe('#db2777');
  });

  it('generates a full calibrated offline dataset with all 27 states and oceanic buoys', () => {
    const data = generateOfflineCalibratedClimateData();
    expect(Object.keys(data.stateWeather)).toHaveLength(27);
    expect(data.stations.length).toBeGreaterThanOrEqual(4);
    expect(data.elNino).toBeDefined();
    expect(data.elNino.phase).toBe('La Niña');
    expect(data.stateWeather['SP'].forecast).toHaveLength(7);
  });

  it('formats Brasília times correctly', () => {
    const timeStr = formatBrasiliaTimeDynamic('14h30');
    expect(timeStr).toBe('14h30');
    const fullDay = formatFullDayTime(new Date('2026-09-03T12:00:00-03:00'));
    expect(fullDay).toContain('12h00');
  });
});

describe('Modular Biodiversity Service & URL Optimizer', () => {
  it('optimizes Wikimedia Commons URLs for thumbnails and cards', () => {
    const raw = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Test_Jaguar.jpg';
    const optimizedCard = getOptimizedBiodiversityImageUrl(raw, 'card');
    expect(optimizedCard).toContain('/thumb/');
    expect(optimizedCard).toContain('/320px-Test_Jaguar.jpg');

    const optimizedFull = getOptimizedBiodiversityImageUrl(raw, 'full');
    expect(optimizedFull).toContain('/1000px-Test_Jaguar.jpg');
  });

  it('optimizes Unsplash URLs with auto format and dimension constraints', () => {
    const raw = 'https://images.unsplash.com/photo-123456';
    const optimized = getOptimizedBiodiversityImageUrl(raw, 'card');
    expect(optimized).toContain('w=360');
    expect(optimized).toContain('auto=format');
  });

  it('synchronously resolves curated Brazilian specimens from national catalog', () => {
    const onca = getScientificImageSync('Panthera onca');
    expect(onca).not.toBeNull();
    expect(onca?.canonicalName).toBe('Onça-Pintada');
    expect(onca?.source).toBe('curated_dataset');

    const mico = getScientificImageSync('Leontopithecus rosalia');
    expect(mico).not.toBeNull();
    expect(mico?.canonicalName).toBe('Mico-Leão-Dourado');
  });
});

describe('Modular Telemetry & API Tracker Service', () => {
  it('tracks API calls, records status and updates quota/savings counters', () => {
    const initialCalls = apiTracker.getTotalCallsToday();
    const initialCached = apiTracker.getTotalCachedToday();

    apiTracker.trackCall('open-meteo', '/v1/forecast/test', 120, 'success', 200, 'Test call');
    expect(apiTracker.getTotalCallsToday()).toBe(initialCalls + 1);

    apiTracker.trackCall('open-meteo', '/v1/forecast/test', 2, 'cached', 200, 'Cached test');
    expect(apiTracker.getTotalCachedToday()).toBe(initialCached + 1);

    const logs = apiTracker.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].provider).toBe('open-meteo');

    const summary = apiTracker.getProvidersSummary();
    const openMeteoSummary = summary.find((s) => s.id === 'open-meteo');
    expect(openMeteoSummary).toBeDefined();
    expect(openMeteoSummary?.status).toBe('online');

    const recommendations = apiTracker.getWeeklyRecommendations();
    expect(recommendations.length).toBeGreaterThanOrEqual(5);
    const recMeteo = recommendations.find((r) => r.providerId === 'open-meteo');
    expect(recMeteo?.riskLevel).toBe('baixo');
  });
});
