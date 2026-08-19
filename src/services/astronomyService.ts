/**
 * Serviço de Efemérides Astronômicas, Posição do Sol/Lua e Radiação
 * Sincronizado estritamente com o Horário Oficial de Brasília (UTC-3).
 */

export interface CelestialEphemeris {
  brasiliaTimeFormatted: string; // Ex: "15:04:22 BRT (UTC-3)"
  hours: number;
  minutes: number;
  seconds: number;
  isNight: boolean;
  isTwilight: boolean;
  twilightType: 'dawn' | 'dusk' | 'none';
  
  // Dados Solares
  sunElevation: number; // Graus (-90° a +90°)
  sunAzimuth: number; // Graus (0° a 360°, 0=Norte, 90=Leste, 180=Sul, 270=Oeste)
  sunAzimuthCardinal: string; // Ex: "NW", "ENE", "W"
  sunIntensity: number; // 0.0 (meia-noite) a 1.0 (meio-dia solar)
  
  // Radiação & Atmosfera
  uvIndex: number; // 0 a 12+
  uvCategory: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto' | 'Extremo';
  ozoneColumnDU: number; // Unidades Dobson (DU), típico 250 - 280 DU no Brasil
  
  // Dados Lunares
  moonPhaseName: string; // Ex: "Crescente", "Cheia", "Nova", "Minguante"
  moonPhaseIndex: number; // 0 (Nova) a 0.5 (Cheia) a 1.0
  moonIlluminationPercent: number; // 0% a 100%
  moonElevation: number; // Graus
  moonAzimuth: number; // Graus
  moonAzimuthCardinal: string;
}

/**
 * Converte qualquer instante Date para o Horário de Brasília (UTC-3).
 */
export function getBrasiliaDate(date: Date = new Date()): Date {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const brasiliaOffsetMs = -3 * 3600000; // UTC-3
  return new Date(utcTime + brasiliaOffsetMs);
}

/**
 * Calcula o ponto cardeal a partir do azimute em graus (0-360°).
 */
export function getCardinalDirection(azimuth: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(((azimuth % 360) / 22.5)) % 16;
  return dirs[idx];
}

/**
 * Calcula as fases da lua baseada no ciclo sinódico (29.53058867 dias).
 */
export function calculateMoonPhase(date: Date = new Date()): { phaseName: string; phaseFraction: number; illumination: number } {
  // Lua Nova de referência conhecida: 11 de Janeiro de 2024, 11:57 UTC
  const refNewMoonMs = Date.UTC(2024, 0, 11, 11, 57);
  const synodicPeriodMs = 29.53058867 * 86400000;
  
  const elapsedMs = date.getTime() - refNewMoonMs;
  const phaseFraction = ((elapsedMs % synodicPeriodMs) + synodicPeriodMs) % synodicPeriodMs / synodicPeriodMs;
  
  // Iluminação percentual (0% na nova, 100% na cheia)
  const illumination = Math.round((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2 * 100);
  
  let phaseName = 'Lua Nova';
  if (phaseFraction < 0.03 || phaseFraction > 0.97) phaseName = 'Lua Nova';
  else if (phaseFraction < 0.22) phaseName = 'Crescente';
  else if (phaseFraction < 0.28) phaseName = 'Quarto Crescente';
  else if (phaseFraction < 0.47) phaseName = 'Gibosa Crescente';
  else if (phaseFraction < 0.53) phaseName = 'Lua Cheia';
  else if (phaseFraction < 0.72) phaseName = 'Gibosa Minguante';
  else if (phaseFraction < 0.78) phaseName = 'Quarto Minguante';
  else phaseName = 'Minguante Balsâmica';
  
  return { phaseName, phaseFraction, illumination };
}

/**
 * Obtém as efemérides celestes completas para a Hora Oficial de Brasília.
 * @param customOverrideMode 'auto' | 'day' | 'night'
 */
export function getBrasiliaCelestialEphemeris(
  customOverrideMode: 'auto' | 'day' | 'night' = 'auto',
  customDate?: Date
): CelestialEphemeris {
  const brDate = getBrasiliaDate(customDate || new Date());
  const hours = brDate.getHours();
  const minutes = brDate.getMinutes();
  const seconds = brDate.getSeconds();
  
  const decimalHour = hours + minutes / 60 + seconds / 3600;
  
  // Horas solares médias no Brasil Central (Goiás / Brasília: Lat ~ -15.8°, Long ~ -47.9°)
  // Nascer do Sol ~ 06:05, Meio-dia solar ~ 12:15, Pôr do Sol ~ 18:20
  const solarNoonHour = 12.25;
  const hourAngle = (decimalHour - solarNoonHour) * 15; // 15 graus por hora
  
  // Elevação solar estimada para a latitude central do Brasil (-15.8°)
  // Ao meio-dia solar atinge cerca de 68° a 78° dependendo da época do ano
  const maxNoonElevation = 72;
  const cosElevation = Math.cos((hourAngle * Math.PI) / 180);
  let sunElevation = maxNoonElevation * cosElevation;
  
  // Azimute Solar
  // Manhã (Leste ~ 80°-100°), Meio-dia (Norte no hemisfério Sul ~ 350°-10°), Tarde (Oeste ~ 260°-280°)
  let sunAzimuth = 180 - hourAngle * 1.1;
  if (sunAzimuth < 0) sunAzimuth += 360;
  sunAzimuth = sunAzimuth % 360;
  
  // Determinação Dia / Noite natural
  let isNight = sunElevation <= 0 || decimalHour < 5.75 || decimalHour > 18.5;
  let isTwilight = false;
  let twilightType: 'dawn' | 'dusk' | 'none' = 'none';
  
  if (decimalHour >= 5.5 && decimalHour <= 6.3) {
    isTwilight = true;
    twilightType = 'dawn';
  } else if (decimalHour >= 17.8 && decimalHour <= 18.7) {
    isTwilight = true;
    twilightType = 'dusk';
  }
  
  // Sobrescrita manual se solicitada pelo usuário
  if (customOverrideMode === 'day') {
    isNight = false;
    if (sunElevation <= 0) sunElevation = 45;
  } else if (customOverrideMode === 'night') {
    isNight = true;
    if (sunElevation > 0) sunElevation = -35;
  }
  
  // Intensidade solar (0 a 1)
  const sunIntensity = isNight ? 0 : Math.max(0, Math.min(1, sunElevation / maxNoonElevation));
  
  // Cálculo de UV e Ozônio
  const uvRaw = Math.max(0, Math.sin((Math.max(0, sunElevation) * Math.PI) / 180) * 11.8);
  const uvIndex = Math.round(uvRaw * 10) / 10;
  
  let uvCategory: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto' | 'Extremo' = 'Baixo';
  if (uvIndex >= 11) uvCategory = 'Extremo';
  else if (uvIndex >= 8) uvCategory = 'Muito Alto';
  else if (uvIndex >= 6) uvCategory = 'Alto';
  else if (uvIndex >= 3) uvCategory = 'Moderado';
  
  // Coluna de Ozônio (Unidades Dobson - DU): média tropical brasileira 255 - 275 DU
  const ozoneColumnDU = Math.round(262 + Math.sin(decimalHour * 0.26) * 8);
  
  // Efemérides da Lua
  const moon = calculateMoonPhase(customDate || new Date());
  // Posição da lua (oposta ao sol aproximadamente)
  let moonElevation = -sunElevation + 15;
  if (!isNight) moonElevation = Math.min(-10, moonElevation);
  else moonElevation = Math.max(15, Math.min(85, moonElevation));
  
  let moonAzimuth = (sunAzimuth + 180) % 360;
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const brasiliaTimeFormatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} BRT (UTC-3)`;
  
  return {
    brasiliaTimeFormatted,
    hours,
    minutes,
    seconds,
    isNight,
    isTwilight,
    twilightType,
    sunElevation: Math.round(sunElevation * 10) / 10,
    sunAzimuth: Math.round(sunAzimuth * 10) / 10,
    sunAzimuthCardinal: getCardinalDirection(sunAzimuth),
    sunIntensity,
    uvIndex: isNight ? 0 : uvIndex,
    uvCategory: isNight ? 'Baixo' : uvCategory,
    ozoneColumnDU,
    moonPhaseName: moon.phaseName,
    moonPhaseIndex: moon.phaseFraction,
    moonIlluminationPercent: moon.illumination,
    moonElevation: Math.round(moonElevation * 10) / 10,
    moonAzimuth: Math.round(moonAzimuth * 10) / 10,
    moonAzimuthCardinal: getCardinalDirection(moonAzimuth),
  };
}
