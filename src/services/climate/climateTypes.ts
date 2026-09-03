/**
 * Definições de Tipos para o Sistema Meteorológico e Oceanográfico
 */

export interface StateForecastDay {
  dayIndex: number;
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  rainSum: number;
  rainProb: number;
  weatherCode: number;
  condition: string;
}

export interface StateWeatherData {
  stateId: string;
  stateName: string;
  capital: string;
  lat: number;
  lng: number;
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  uvIndex: number;
  weatherCode: number;
  condition?: string;
  forecast?: StateForecastDay[];
}

export interface ClimateStationData {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  isMarine: boolean;
  phenomenon: string;
}

export interface ElNinoIndexData {
  phase: 'El Niño' | 'La Niña' | 'Neutro';
  seaTempAnomaly: number;
  intensity: 'Forte' | 'Moderado' | 'Fraco' | 'Neutro' | 'Fraco a Moderado' | 'Moderado a Forte';
  description: string;
  impactsBrazil: {
    norte: string;
    nordeste: string;
    centroOeste: string;
    sudeste: string;
    sul: string;
  };
}

export interface ClimateTelemetryResponse {
  fetchedAt?: number;
  updatedAt: string;
  updatedAtH?: string;
  dateTimeFormatted: string;
  stateWeather: Record<string, StateWeatherData>;
  stations: ClimateStationData[];
  elNino: ElNinoIndexData;
  avgTempBrazil: number;
  maxTempState: { stateId: string; temp: number };
  minTempState: { stateId: string; temp: number };
  isServerCache?: boolean;
  forced?: boolean;
}
