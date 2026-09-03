/**
 * Formatadores Numéricos, Textuais e Cartográficos Parametrizados
 * Projeto: BR Quest / Brasil Interativo
 * 
 * Centraliza e unifica formatações em toda a aplicação garantindo consistência
 * visual e sem repetição de código.
 */

/**
 * Formata um número no padrão brasileiro (pt-BR).
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata população de forma humanizada e compacta (ex: 44,4 mi ou 850 mil).
 */
export function formatPopulation(pop: number): string {
  if (!pop || isNaN(pop)) return '0 hab.';
  if (pop >= 1_000_000) {
    const millions = pop / 1_000_000;
    return `${millions.toFixed(1).replace('.', ',')} mi hab.`;
  }
  if (pop >= 1_000) {
    const thousands = Math.round(pop / 1_000);
    return `${thousands} mil hab.`;
  }
  return `${formatNumber(pop)} hab.`;
}

/**
 * Formata moeda no padrão Real Brasileiro (R$).
 */
export function formatCurrencyBRL(value: number, compact: boolean = false): string {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  if (compact) {
    if (value >= 1_000_000_000) {
      return `R$ ${(value / 1_000_000_000).toFixed(1).replace('.', ',')} bi`;
    }
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')} mi`;
    }
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata porcentagem com precisão configurável.
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Formata temperatura em graus Celsius com arredondamento seguro.
 */
export function formatTemperature(temp: number | undefined | null, showUnit: boolean = true): string {
  if (temp === undefined || temp === null || isNaN(temp)) return '--';
  const rounded = Math.round(temp);
  return showUnit ? `${rounded}°C` : `${rounded}°`;
}

/**
 * Formata velocidade do vento em km/h.
 */
export function formatWindSpeed(speedKmh: number | undefined | null): string {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) return '--';
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Formata umidade relativa do ar.
 */
export function formatHumidity(humidity: number | undefined | null): string {
  if (humidity === undefined || humidity === null || isNaN(humidity)) return '--';
  return `${Math.round(humidity)}%`;
}

/**
 * Formata área geográfica em quilômetros quadrados (km²).
 */
export function formatAreaKm2(area: number): string {
  if (!area || isNaN(area)) return '0 km²';
  return `${formatNumber(Math.round(area))} km²`;
}

/**
 * Converte latitude e longitude decimais para notação cartográfica legível (DMS aproximado).
 */
export function formatCoordinates(lat: number, lng: number): string {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) return '--';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'O';
  const absLat = Math.abs(lat);
  const absLng = Math.abs(lng);

  const latDeg = Math.floor(absLat);
  const latMin = Math.round((absLat - latDeg) * 60);

  const lngDeg = Math.floor(absLng);
  const lngMin = Math.round((absLng - lngDeg) * 60);

  return `${latDeg}°${latMin.toString().padStart(2, '0')}'${latDir}, ${lngDeg}°${lngMin.toString().padStart(2, '0')}'${lngDir}`;
}

/**
 * Trunca texto suavemente com reticências sem quebrar palavras ao meio quando possível.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  const sub = text.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.5) {
    return `${sub.slice(0, lastSpace)}...`;
  }
  return `${sub}...`;
}

/**
 * Formata data e hora no estilo do banner Meteored (fuso horário de Brasília UTC-3):
 * Ex: "Terça 18, 15:00 (-03)"
 */
export function formatMeteoredDateTime(date = new Date()): string {
  const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'America/Sao_Paulo' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
  const dayNum = date.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: 'America/Sao_Paulo' });
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  return `${capitalizedDay} ${dayNum}, ${timeStr} (-03)`;
}
