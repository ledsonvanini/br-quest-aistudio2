/**
 * Base Climatológica Offline Calibrada e Coordenadas Geográficas
 * Fornece contingência 100% resiliente para telemetria meteorológica do Brasil
 * quando APIs externas estiverem indisponíveis, sobrecarregadas ou offline.
 */

import type {
  ClimateStationData,
  ClimateTelemetryResponse,
  ElNinoIndexData,
  StateForecastDay,
  StateWeatherData,
} from './climateTypes';
import { formatMeteoredDateTime } from '../../lib/formatters';

export const BRAZIL_STATES_COORDINATES: Array<{
  id: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  baseClimate: { temp: number; hum: number; rain: number; wind: number; windDir: number };
}> = [
  { id: 'AC', name: 'Acre', capital: 'Rio Branco', lat: -9.97, lng: -67.81, baseClimate: { temp: 31.2, hum: 82, rain: 1.4, wind: 9, windDir: 320 } },
  { id: 'AL', name: 'Alagoas', capital: 'Maceió', lat: -9.66, lng: -35.73, baseClimate: { temp: 28.5, hum: 76, rain: 0.2, wind: 22, windDir: 110 } },
  { id: 'AP', name: 'Amapá', capital: 'Macapá', lat: 0.03, lng: -51.05, baseClimate: { temp: 30.8, hum: 84, rain: 3.1, wind: 15, windDir: 60 } },
  { id: 'AM', name: 'Amazonas', capital: 'Manaus', lat: -3.11, lng: -60.02, baseClimate: { temp: 33.4, hum: 80, rain: 2.8, wind: 10, windDir: 80 } },
  { id: 'BA', name: 'Bahia', capital: 'Salvador', lat: -12.97, lng: -38.50, baseClimate: { temp: 29.2, hum: 74, rain: 0.4, wind: 24, windDir: 125 } },
  { id: 'CE', name: 'Ceará', capital: 'Fortaleza', lat: -3.71, lng: -38.54, baseClimate: { temp: 31.0, hum: 71, rain: 0.1, wind: 28, windDir: 95 } },
  { id: 'DF', name: 'Distrito Federal', capital: 'Brasília', lat: -15.79, lng: -47.88, baseClimate: { temp: 26.5, hum: 58, rain: 0.0, wind: 16, windDir: 100 } },
  { id: 'ES', name: 'Espírito Santo', capital: 'Vitória', lat: -20.31, lng: -40.33, baseClimate: { temp: 27.8, hum: 73, rain: 0.3, wind: 20, windDir: 50 } },
  { id: 'GO', name: 'Goiás', capital: 'Goiânia', lat: -16.68, lng: -49.25, baseClimate: { temp: 28.9, hum: 56, rain: 0.0, wind: 14, windDir: 85 } },
  { id: 'MA', name: 'Maranhão', capital: 'São Luís', lat: -2.53, lng: -44.30, baseClimate: { temp: 31.5, hum: 79, rain: 1.2, wind: 19, windDir: 75 } },
  { id: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', lat: -15.60, lng: -56.09, baseClimate: { temp: 35.1, hum: 54, rain: 0.0, wind: 12, windDir: 350 } },
  { id: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.44, lng: -54.64, baseClimate: { temp: 29.8, hum: 62, rain: 0.2, wind: 15, windDir: 30 } },
  { id: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.92, lng: -43.93, baseClimate: { temp: 25.4, hum: 65, rain: 0.0, wind: 13, windDir: 80 } },
  { id: 'PA', name: 'Pará', capital: 'Belém', lat: -1.45, lng: -48.50, baseClimate: { temp: 32.0, hum: 83, rain: 4.2, wind: 14, windDir: 70 } },
  { id: 'PB', name: 'Paraíba', capital: 'João Pessoa', lat: -7.11, lng: -34.86, baseClimate: { temp: 29.0, hum: 75, rain: 0.1, wind: 25, windDir: 115 } },
  { id: 'PR', name: 'Paraná', capital: 'Curitiba', lat: -25.42, lng: -49.27, baseClimate: { temp: 19.8, hum: 78, rain: 0.8, wind: 17, windDir: 85 } },
  { id: 'PE', name: 'Pernambuco', capital: 'Recife', lat: -8.05, lng: -34.88, baseClimate: { temp: 29.5, hum: 77, rain: 0.3, wind: 23, windDir: 120 } },
  { id: 'PI', name: 'Piauí', capital: 'Teresina', lat: -5.08, lng: -42.80, baseClimate: { temp: 34.2, hum: 60, rain: 0.0, wind: 15, windDir: 85 } },
  { id: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.90, lng: -43.17, baseClimate: { temp: 27.2, hum: 72, rain: 0.2, wind: 19, windDir: 170 } },
  { id: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', lat: -5.79, lng: -35.20, baseClimate: { temp: 29.8, hum: 74, rain: 0.1, wind: 26, windDir: 110 } },
  { id: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.03, lng: -51.22, baseClimate: { temp: 17.5, hum: 81, rain: 1.5, wind: 20, windDir: 210 } },
  { id: 'RO', name: 'Rondônia', capital: 'Porto Velho', lat: -8.76, lng: -63.90, baseClimate: { temp: 32.8, hum: 81, rain: 2.0, wind: 11, windDir: 340 } },
  { id: 'RR', name: 'Roraima', capital: 'Boa Vista', lat: 2.82, lng: -60.67, baseClimate: { temp: 34.0, hum: 68, rain: 0.4, wind: 16, windDir: 55 } },
  { id: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', lat: -27.59, lng: -48.54, baseClimate: { temp: 21.4, hum: 79, rain: 0.9, wind: 22, windDir: 190 } },
  { id: 'SP', name: 'São Paulo', capital: 'São Paulo', lat: -23.55, lng: -46.63, baseClimate: { temp: 23.6, hum: 68, rain: 0.1, wind: 16, windDir: 140 } },
  { id: 'SE', name: 'Sergipe', capital: 'Aracaju', lat: -10.91, lng: -37.07, baseClimate: { temp: 28.7, hum: 75, rain: 0.2, wind: 22, windDir: 115 } },
  { id: 'TO', name: 'Tocantins', capital: 'Palmas', lat: -10.21, lng: -48.36, baseClimate: { temp: 33.1, hum: 58, rain: 0.0, wind: 14, windDir: 90 } },
];

export const OCEANIC_MONITORING_POINTS: Array<{
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  phenomenon: string;
  isMarine: boolean;
}> = [
  { id: 'atlantico_equatorial', name: 'Atlântico Equatorial / Foz Amazonas', region: 'Norte / Oceano', lat: 0.5, lng: -48.0, phenomenon: 'Ventos Alísios de NE & Rios Voadores', isMarine: true },
  { id: 'costa_nordeste', name: 'Costa Leste Nordeste (RN/PB/PE)', region: 'Nordeste / Oceano', lat: -6.5, lng: -34.8, phenomenon: 'Ventos Alísios de SE & Corrente do Brasil', isMarine: true },
  { id: 'bacia_santos', name: 'Bacia de Santos / Sudeste Marítimo', region: 'Sudeste / Oceano', lat: -24.5, lng: -44.5, phenomenon: 'Corrente das Malvinas & Frentes Frias', isMarine: true },
  { id: 'bacia_prata', name: 'Fronteira Sul / Bacia do Prata', region: 'Sul / Oceano', lat: -31.5, lng: -50.0, phenomenon: 'Massa de Ar Polar Atlântica (MPA)', isMarine: true },
];

export const ECMWF_TEMP_COLOR_STOPS = [
  { temp: -4, hex: '#bae6fd', label: '-4°C' },
  { temp: 0, hex: '#38bdf8', label: '0°C' },
  { temp: 4, hex: '#0284c7', label: '4°C' },
  { temp: 8, hex: '#0f766e', label: '8°C' },
  { temp: 12, hex: '#16a34a', label: '12°C' },
  { temp: 16, hex: '#22c55e', label: '16°C' },
  { temp: 20, hex: '#a3e635', label: '20°C' },
  { temp: 24, hex: '#fde047', label: '24°C' },
  { temp: 28, hex: '#fb923c', label: '28°C' },
  { temp: 32, hex: '#ea580c', label: '32°C' },
  { temp: 36, hex: '#dc2626', label: '36°C' },
  { temp: 40, hex: '#991b1b', label: '40°C' },
];

export function getEcmwfTempColor(temp: number): { hex: string; bgClass: string; textClass: string } {
  if (temp <= -2) return { hex: '#bae6fd', bgClass: 'bg-sky-200', textClass: 'text-sky-950' };
  if (temp <= 2) return { hex: '#38bdf8', bgClass: 'bg-sky-400', textClass: 'text-slate-950' };
  if (temp <= 6) return { hex: '#0284c7', bgClass: 'bg-sky-600', textClass: 'text-white' };
  if (temp <= 10) return { hex: '#0f766e', bgClass: 'bg-teal-700', textClass: 'text-white' };
  if (temp <= 14) return { hex: '#16a34a', bgClass: 'bg-emerald-600', textClass: 'text-white' };
  if (temp <= 18) return { hex: '#22c55e', bgClass: 'bg-green-500', textClass: 'text-slate-950' };
  if (temp <= 22) return { hex: '#a3e635', bgClass: 'bg-lime-400', textClass: 'text-slate-950' };
  if (temp <= 26) return { hex: '#fde047', bgClass: 'bg-yellow-300', textClass: 'text-amber-950' };
  if (temp <= 30) return { hex: '#fb923c', bgClass: 'bg-orange-400', textClass: 'text-amber-950' };
  if (temp <= 34) return { hex: '#ea580c', bgClass: 'bg-orange-600', textClass: 'text-white' };
  if (temp <= 38) return { hex: '#dc2626', bgClass: 'bg-red-600', textClass: 'text-white' };
  return { hex: '#991b1b', bgClass: 'bg-red-800', textClass: 'text-white' };
}

export function getRainRadarColor(rainMm: number): string {
  if (rainMm <= 0.1) return 'transparent';
  if (rainMm <= 1.0) return '#38bdf8';
  if (rainMm <= 3.0) return '#0284c7';
  if (rainMm <= 8.0) return '#16a34a';
  if (rainMm <= 15.0) return '#eab308';
  if (rainMm <= 30.0) return '#ea580c';
  return '#db2777';
}

export function generateOfflineCalibratedClimateData(): ClimateTelemetryResponse {
  const stateWeather: Record<string, StateWeatherData> = {};
  const dayNames = ['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  BRAZIL_STATES_COORDINATES.forEach((state) => {
    const baseT = state.baseClimate.temp;
    const forecast: StateForecastDay[] = [];
    for (let d = 0; d < 7; d++) {
      forecast.push({
        dayIndex: d,
        date: `2026-09-${2 + d}`,
        dayName: dayNames[d] || `+${d}d`,
        maxTemp: Math.round((baseT + 3.2 + (d % 2) * 0.8) * 10) / 10,
        minTemp: Math.round((baseT - 4.1 - (d % 3) * 0.4) * 10) / 10,
        rainSum: state.baseClimate.rain * (d % 2 === 0 ? 1.2 : 0.4),
        rainProb: state.baseClimate.rain > 1.0 ? 65 : 20,
        weatherCode: state.baseClimate.rain > 2.0 ? 61 : 1,
        condition: state.baseClimate.rain > 2.0 ? 'Pancadas de Chuva' : 'Ensolarado',
      });
    }

    stateWeather[state.id] = {
      stateId: state.id,
      stateName: state.name,
      capital: state.capital,
      lat: state.lat,
      lng: state.lng,
      temperature: baseT,
      minTemperature: Math.round((baseT - 4.45) * 100) / 100,
      maxTemperature: Math.round((baseT + 3.25) * 100) / 100,
      apparentTemperature: baseT + 1,
      humidity: state.baseClimate.hum,
      precipitation: state.baseClimate.rain,
      windSpeed: state.baseClimate.wind,
      windDirection: state.baseClimate.windDir,
      surfacePressure: 1013,
      uvIndex: state.lat > -15 ? 8.5 : 6.0,
      weatherCode: 1,
      condition: 'Parcialmente Nublado',
      forecast,
    };
  });

  const stations: ClimateStationData[] = OCEANIC_MONITORING_POINTS.map((pt) => ({
    id: pt.id,
    name: pt.name,
    region: pt.region,
    lat: pt.lat,
    lng: pt.lng,
    temperature: 26.5 + (pt.lat > -10 ? 2 : -3),
    humidity: 78,
    precipitation: 0.2,
    windSpeed: 22,
    windDirection: pt.lat > -10 ? 65 : 120,
    surfacePressure: 1014,
    isMarine: pt.isMarine,
    phenomenon: pt.phenomenon,
  }));

  const stateValues = Object.values(stateWeather);
  const totalTemp = stateValues.reduce((acc, s) => acc + s.temperature, 0);
  const avgTempBrazil = Math.round((totalTemp / stateValues.length) * 10) / 10;

  let maxTempState = { stateId: 'MT', temp: -99 };
  let minTempState = { stateId: 'RS', temp: 99 };
  stateValues.forEach((s) => {
    if (s.temperature > maxTempState.temp) maxTempState = { stateId: s.stateId, temp: s.temperature };
    if (s.temperature < minTempState.temp) minTempState = { stateId: s.stateId, temp: s.temperature };
  });

  const now = new Date();
  const hours = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

  return {
    fetchedAt: Date.now(),
    updatedAt: hours,
    updatedAtH: hours.replace(':', 'h'),
    dateTimeFormatted: formatMeteoredDateTime(now),
    stateWeather,
    stations,
    elNino: MOCK_EL_NINO_INDEX,
    avgTempBrazil,
    maxTempState,
    minTempState,
  };
}

export const MOCK_EL_NINO_INDEX: ElNinoIndexData = {
  phase: 'La Niña',
  seaTempAnomaly: -0.8,
  intensity: 'Fraco a Moderado',
  description: 'Resfriamento das águas superficiais do Oceano Pacífico Equatorial (Niño 3.4), intensificando os ventos alísios e concentrando umidade na Bacia Amazônica e Nordeste.',
  impactsBrazil: {
    norte: 'Chuvas regulares e rios com volume elevado.',
    nordeste: 'Aumento das chuvas no semiárido e litoral leste.',
    centroOeste: 'Estação chuvosa bem distribuída.',
    sudeste: 'Maior variabilidade térmica com frentes frias regulares.',
    sul: 'Tendência a estiagens periódicas no extremo sul.',
  },
};

export function getConditionNameByWmoCode(wCode: number): string {
  if (wCode === 0) return 'Céu Limpo / Ensolarado';
  if (wCode <= 3) return 'Parcialmente Nublado';
  if (wCode <= 48) return 'Nevoeiro / Neblina';
  if (wCode <= 57) return 'Garoa Leve';
  if (wCode <= 67) return 'Chuva Contínua';
  if (wCode <= 82) return 'Pancadas de Chuva';
  return 'Tempestades & Trovoadas';
}

export const buildFallbackClimateTelemetry = generateOfflineCalibratedClimateData;
