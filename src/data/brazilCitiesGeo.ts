/**
 * Comprehensive Geographic Coordinates and Metadata for Major Brazilian Cities
 * Used for point-to-point geodesic routing between specific Brazilian municipalities.
 */

export interface BrazilianCityGeo {
  id: string;
  name: string;
  uf: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  lat: number;
  lng: number;
  isCapital?: boolean;
}

export const BRAZIL_MAJOR_CITIES: BrazilianCityGeo[] = [
  // --- CAPITAIS (27 UFs) ---
  { id: 'brasilia', name: 'Brasília', uf: 'DF', region: 'Centro-Oeste', lat: -15.7975, lng: -47.8919, isCapital: true },
  { id: 'sao-paulo', name: 'São Paulo', uf: 'SP', region: 'Sudeste', lat: -23.5505, lng: -46.6333, isCapital: true },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', uf: 'RJ', region: 'Sudeste', lat: -22.9068, lng: -43.1729, isCapital: true },
  { id: 'belo-horizonte', name: 'Belo Horizonte', uf: 'MG', region: 'Sudeste', lat: -19.9167, lng: -43.9345, isCapital: true },
  { id: 'vitoria', name: 'Vitória', uf: 'ES', region: 'Sudeste', lat: -20.3155, lng: -40.3128, isCapital: true },
  { id: 'salvador', name: 'Salvador', uf: 'BA', region: 'Nordeste', lat: -12.9777, lng: -38.5016, isCapital: true },
  { id: 'recife', name: 'Recife', uf: 'PE', region: 'Nordeste', lat: -8.0476, lng: -34.8770, isCapital: true },
  { id: 'fortaleza', name: 'Fortaleza', uf: 'CE', region: 'Nordeste', lat: -3.7172, lng: -38.5433, isCapital: true },
  { id: 'sao-luis', name: 'São Luís', uf: 'MA', region: 'Nordeste', lat: -2.5307, lng: -44.3068, isCapital: true },
  { id: 'natal', name: 'Natal', uf: 'RN', region: 'Nordeste', lat: -5.7945, lng: -35.2110, isCapital: true },
  { id: 'joao-pessoa', name: 'João Pessoa', uf: 'PB', region: 'Nordeste', lat: -7.1195, lng: -34.8450, isCapital: true },
  { id: 'maceio', name: 'Maceió', uf: 'AL', region: 'Nordeste', lat: -9.6658, lng: -35.7351, isCapital: true },
  { id: 'aracaju', name: 'Aracaju', uf: 'SE', region: 'Nordeste', lat: -10.9472, lng: -37.0731, isCapital: true },
  { id: 'teresina', name: 'Teresina', uf: 'PI', region: 'Nordeste', lat: -5.0920, lng: -42.8038, isCapital: true },
  { id: 'curitiba', name: 'Curitiba', uf: 'PR', region: 'Sul', lat: -25.4290, lng: -49.2671, isCapital: true },
  { id: 'florianopolis', name: 'Florianópolis', uf: 'SC', region: 'Sul', lat: -27.5954, lng: -48.5480, isCapital: true },
  { id: 'porto-alegre', name: 'Porto Alegre', uf: 'RS', region: 'Sul', lat: -30.0346, lng: -51.2177, isCapital: true },
  { id: 'goiania', name: 'Goiânia', uf: 'GO', region: 'Centro-Oeste', lat: -16.6869, lng: -49.2648, isCapital: true },
  { id: 'cuiaba', name: 'Cuiabá', uf: 'MT', region: 'Centro-Oeste', lat: -15.6014, lng: -56.0979, isCapital: true },
  { id: 'campo-grande', name: 'Campo Grande', uf: 'MS', region: 'Centro-Oeste', lat: -20.4697, lng: -54.6201, isCapital: true },
  { id: 'manaus', name: 'Manaus', uf: 'AM', region: 'Norte', lat: -3.1190, lng: -60.0217, isCapital: true },
  { id: 'belem', name: 'Belém', uf: 'PA', region: 'Norte', lat: -1.4558, lng: -48.4902, isCapital: true },
  { id: 'porto-velho', name: 'Porto Velho', uf: 'RO', region: 'Norte', lat: -8.7619, lng: -63.9039, isCapital: true },
  { id: 'rio-branco', name: 'Rio Branco', uf: 'AC', region: 'Norte', lat: -9.9754, lng: -67.8249, isCapital: true },
  { id: 'macapa', name: 'Macapá', uf: 'AP', region: 'Norte', lat: 0.0349, lng: -51.0694, isCapital: true },
  { id: 'boa-vista', name: 'Boa Vista', uf: 'RR', region: 'Norte', lat: 2.8235, lng: -60.6758, isCapital: true },
  { id: 'palmas', name: 'Palmas', uf: 'TO', region: 'Norte', lat: -10.2491, lng: -48.3243, isCapital: true },

  // --- GRANDES CIDADES DO INTERIOR & LITORAL ---
  // São Paulo
  { id: 'campinas', name: 'Campinas', uf: 'SP', region: 'Sudeste', lat: -22.9056, lng: -47.0608 },
  { id: 'santos', name: 'Santos', uf: 'SP', region: 'Sudeste', lat: -23.9608, lng: -46.3336 },
  { id: 'ribeirao-preto', name: 'Ribeirão Preto', uf: 'SP', region: 'Sudeste', lat: -21.1775, lng: -47.8103 },
  { id: 'sao-jose-dos-campos', name: 'São José dos Campos', uf: 'SP', region: 'Sudeste', lat: -23.1791, lng: -45.8872 },
  { id: 'sorocaba', name: 'Sorocaba', uf: 'SP', region: 'Sudeste', lat: -23.5015, lng: -47.4526 },
  { id: 'sao-jose-do-rio-preto', name: 'São José do Rio Preto', uf: 'SP', region: 'Sudeste', lat: -20.8113, lng: -49.3758 },
  { id: 'piracicaba', name: 'Piracicaba', uf: 'SP', region: 'Sudeste', lat: -22.7338, lng: -47.6476 },
  { id: 'bauru', name: 'Bauru', uf: 'SP', region: 'Sudeste', lat: -22.3147, lng: -49.0606 },
  { id: 'franca', name: 'Franca', uf: 'SP', region: 'Sudeste', lat: -20.5386, lng: -47.4008 },
  { id: 'presidente-prudente', name: 'Presidente Prudente', uf: 'SP', region: 'Sudeste', lat: -22.1256, lng: -51.3889 },

  // Rio de Janeiro
  { id: 'niteroi', name: 'Niterói', uf: 'RJ', region: 'Sudeste', lat: -22.8859, lng: -43.1153 },
  { id: 'petropolis', name: 'Petrópolis', uf: 'RJ', region: 'Sudeste', lat: -22.5050, lng: -43.1789 },
  { id: 'campos-dos-goytacazes', name: 'Campos dos Goytacazes', uf: 'RJ', region: 'Sudeste', lat: -21.7545, lng: -41.3244 },
  { id: 'volta-redonda', name: 'Volta Redonda', uf: 'RJ', region: 'Sudeste', lat: -22.5232, lng: -44.1041 },
  { id: 'cabo-frio', name: 'Cabo Frio', uf: 'RJ', region: 'Sudeste', lat: -22.8794, lng: -42.0186 },
  { id: 'angra-dos-reis', name: 'Angra dos Reis', uf: 'RJ', region: 'Sudeste', lat: -23.0067, lng: -44.3181 },

  // Minas Gerais
  { id: 'uberlandia', name: 'Uberlândia', uf: 'MG', region: 'Sudeste', lat: -18.9186, lng: -48.2772 },
  { id: 'juiz-de-fora', name: 'Juiz de Fora', uf: 'MG', region: 'Sudeste', lat: -21.7642, lng: -43.3503 },
  { id: 'montes-claros', name: 'Montes Claros', uf: 'MG', region: 'Sudeste', lat: -16.7282, lng: -43.8578 },
  { id: 'uberaba', name: 'Uberaba', uf: 'MG', region: 'Sudeste', lat: -19.7483, lng: -47.9319 },
  { id: 'governador-valadares', name: 'Governador Valadares', uf: 'MG', region: 'Sudeste', lat: -18.8511, lng: -41.9494 },
  { id: 'ipatinga', name: 'Ipatinga', uf: 'MG', region: 'Sudeste', lat: -19.4688, lng: -42.5367 },
  { id: 'ouro-preto', name: 'Ouro Preto', uf: 'MG', region: 'Sudeste', lat: -20.3856, lng: -43.5035 },
  { id: 'pocos-de-caldas', name: 'Poços de Caldas', uf: 'MG', region: 'Sudeste', lat: -21.7878, lng: -46.5614 },

  // Espírito Santo
  { id: 'vila-velha', name: 'Vila Velha', uf: 'ES', region: 'Sudeste', lat: -20.3297, lng: -40.2925 },
  { id: 'serra', name: 'Serra', uf: 'ES', region: 'Sudeste', lat: -20.1286, lng: -40.3078 },
  { id: 'linhares', name: 'Linhares', uf: 'ES', region: 'Sudeste', lat: -19.3911, lng: -40.0722 },
  { id: 'cachoeiro-de-itapemirim', name: 'Cachoeiro de Itapemirim', uf: 'ES', region: 'Sudeste', lat: -20.8489, lng: -41.1128 },

  // Paraná
  { id: 'londrina', name: 'Londrina', uf: 'PR', region: 'Sul', lat: -23.3045, lng: -51.1696 },
  { id: 'maringa', name: 'Maringá', uf: 'PR', region: 'Sul', lat: -23.4205, lng: -51.9333 },
  { id: 'foz-do-iguacu', name: 'Foz do Iguaçu', uf: 'PR', region: 'Sul', lat: -25.5478, lng: -54.5882 },
  { id: 'ponta-grossa', name: 'Ponta Grossa', uf: 'PR', region: 'Sul', lat: -25.0994, lng: -50.1583 },
  { id: 'cascavel', name: 'Cascavel', uf: 'PR', region: 'Sul', lat: -24.9578, lng: -53.4595 },
  { id: 'guarapuava', name: 'Guarapuava', uf: 'PR', region: 'Sul', lat: -25.3953, lng: -51.4625 },

  // Santa Catarina
  { id: 'joinville', name: 'Joinville', uf: 'SC', region: 'Sul', lat: -26.3045, lng: -48.8487 },
  { id: 'blumenau', name: 'Blumenau', uf: 'SC', region: 'Sul', lat: -26.9194, lng: -49.0661 },
  { id: 'chapeco', name: 'Chapecó', uf: 'SC', region: 'Sul', lat: -27.1004, lng: -52.6152 },
  { id: 'criciuma', name: 'Criciúma', uf: 'SC', region: 'Sul', lat: -28.6775, lng: -49.3703 },
  { id: 'balneario-camboriu', name: 'Balneário Camboriú', uf: 'SC', region: 'Sul', lat: -26.9926, lng: -48.6347 },
  { id: 'lages', name: 'Lages', uf: 'SC', region: 'Sul', lat: -27.8161, lng: -50.3261 },

  // Rio Grande do Sul
  { id: 'caxias-do-sul', name: 'Caxias do Sul', uf: 'RS', region: 'Sul', lat: -29.1678, lng: -51.1794 },
  { id: 'pelotas', name: 'Pelotas', uf: 'RS', region: 'Sul', lat: -31.7654, lng: -52.3376 },
  { id: 'santa-maria', name: 'Santa Maria', uf: 'RS', region: 'Sul', lat: -29.6842, lng: -53.8069 },
  { id: 'passo-fundo', name: 'Passo Fundo', uf: 'RS', region: 'Sul', lat: -28.2628, lng: -52.4092 },
  { id: 'rio-grande', name: 'Rio Grande', uf: 'RS', region: 'Sul', lat: -32.0350, lng: -52.0986 },
  { id: 'uruguaiana', name: 'Uruguaiana', uf: 'RS', region: 'Sul', lat: -29.7547, lng: -57.0883 },
  { id: 'gramado', name: 'Gramado', uf: 'RS', region: 'Sul', lat: -29.3789, lng: -50.8739 },

  // Bahia
  { id: 'feira-de-santana', name: 'Feira de Santana', uf: 'BA', region: 'Nordeste', lat: -12.2667, lng: -38.9667 },
  { id: 'vitoria-da-conquista', name: 'Vitória da Conquista', uf: 'BA', region: 'Nordeste', lat: -14.8661, lng: -40.8394 },
  { id: 'ilheus', name: 'Ilhéus', uf: 'BA', region: 'Nordeste', lat: -14.7889, lng: -39.0494 },
  { id: 'itabuna', name: 'Itabuna', uf: 'BA', region: 'Nordeste', lat: -14.7939, lng: -39.2778 },
  { id: 'porto-seguro', name: 'Porto Seguro', uf: 'BA', region: 'Nordeste', lat: -16.4497, lng: -39.0647 },
  { id: 'juazeiro', name: 'Juazeiro', uf: 'BA', region: 'Nordeste', lat: -9.4167, lng: -40.5000 },
  { id: 'barreiras', name: 'Barreiras', uf: 'BA', region: 'Nordeste', lat: -12.1528, lng: -44.9961 },

  // Pernambuco
  { id: 'caruaru', name: 'Caruaru', uf: 'PE', region: 'Nordeste', lat: -8.2833, lng: -35.9667 },
  { id: 'petrolina', name: 'Petrolina', uf: 'PE', region: 'Nordeste', lat: -9.3986, lng: -40.5008 },
  { id: 'garanhuns', name: 'Garanhuns', uf: 'PE', region: 'Nordeste', lat: -8.8903, lng: -36.4928 },

  // Ceará
  { id: 'juazeiro-do-norte', name: 'Juazeiro do Norte', uf: 'CE', region: 'Nordeste', lat: -7.2025, lng: -39.3150 },
  { id: 'sobral', name: 'Sobral', uf: 'CE', region: 'Nordeste', lat: -3.6894, lng: -40.3489 },
  { id: 'crato', name: 'Crato', uf: 'CE', region: 'Nordeste', lat: -7.2342, lng: -39.4094 },

  // Paraíba
  { id: 'campina-grande', name: 'Campina Grande', uf: 'PB', region: 'Nordeste', lat: -7.2247, lng: -35.8811 },
  { id: 'patos', name: 'Patos', uf: 'PB', region: 'Nordeste', lat: -7.0244, lng: -37.2800 },

  // Rio Grande do Norte
  { id: 'mossoro', name: 'Mossoró', uf: 'RN', region: 'Nordeste', lat: -5.1878, lng: -37.3442 },
  { id: 'caico', name: 'Caicó', uf: 'RN', region: 'Nordeste', lat: -6.4583, lng: -37.0978 },

  // Alagoas & Sergipe
  { id: 'arapiraca', name: 'Arapiraca', uf: 'AL', region: 'Nordeste', lat: -9.7547, lng: -36.6614 },
  { id: 'itabaiana', name: 'Itabaiana', uf: 'SE', region: 'Nordeste', lat: -10.6850, lng: -37.4253 },

  // Maranhão & Piauí
  { id: 'imperatriz', name: 'Imperatriz', uf: 'MA', region: 'Nordeste', lat: -5.5264, lng: -47.4917 },
  { id: 'caxias', name: 'Caxias', uf: 'MA', region: 'Nordeste', lat: -4.8589, lng: -43.3561 },
  { id: 'parnaiba', name: 'Parnaíba', uf: 'PI', region: 'Nordeste', lat: -2.9031, lng: -41.7767 },
  { id: 'picos', name: 'Picos', uf: 'PI', region: 'Nordeste', lat: -7.0769, lng: -41.4669 },

  // Goiás, Mato Grosso e Mato Grosso do Sul
  { id: 'anapolis', name: 'Anápolis', uf: 'GO', region: 'Centro-Oeste', lat: -16.3267, lng: -48.9533 },
  { id: 'rio-verde', name: 'Rio Verde', uf: 'GO', region: 'Centro-Oeste', lat: -17.7922, lng: -50.9192 },
  { id: 'rondonopolis', name: 'Rondonópolis', uf: 'MT', region: 'Centro-Oeste', lat: -16.4675, lng: -54.6372 },
  { id: 'sinop', name: 'Sinop', uf: 'MT', region: 'Centro-Oeste', lat: -11.8608, lng: -55.5097 },
  { id: 'dourados', name: 'Dourados', uf: 'MS', region: 'Centro-Oeste', lat: -22.2231, lng: -54.8119 },
  { id: 'corumba', name: 'Corumbá', uf: 'MS', region: 'Centro-Oeste', lat: -19.0097, lng: -57.6533 },

  // Pará e Amazonas
  { id: 'santarem', name: 'Santarém', uf: 'PA', region: 'Norte', lat: -2.4431, lng: -54.7083 },
  { id: 'maraba', name: 'Marabá', uf: 'PA', region: 'Norte', lat: -5.3686, lng: -49.1178 },
  { id: 'parintins', name: 'Parintins', uf: 'AM', region: 'Norte', lat: -2.6283, lng: -56.7358 },
  { id: 'itacoatiara', name: 'Itacoatiara', uf: 'AM', region: 'Norte', lat: -3.1431, lng: -58.4442 },

  // Rondônia, Acre, Roraima, Amapá e Tocantins
  { id: 'ji-parana', name: 'Ji-Paraná', uf: 'RO', region: 'Norte', lat: -10.8828, lng: -61.9458 },
  { id: 'cruzeiro-do-sul', name: 'Cruzeiro do Sul', uf: 'AC', region: 'Norte', lat: -7.6311, lng: -72.6700 },
  { id: 'araguaina', name: 'Araguaína', uf: 'TO', region: 'Norte', lat: -7.1914, lng: -48.2072 },
  { id: 'santana', name: 'Santana', uf: 'AP', region: 'Norte', lat: -0.0583, lng: -51.1817 },
];

/**
 * Filter Brazilian cities by text query
 */
export function filterBrazilianCities(search: string): BrazilianCityGeo[] {
  if (!search.trim()) return BRAZIL_MAJOR_CITIES.slice(0, 20);
  const normalized = search
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return BRAZIL_MAJOR_CITIES.filter((c) => {
    const nameNorm = c.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const ufNorm = c.uf.toLowerCase();
    return nameNorm.includes(normalized) || ufNorm === normalized;
  }).slice(0, 25);
}

export type BrazilCityGeo = BrazilianCityGeo;

/**
 * Finds a city in the catalog by exact or normalized name
 */
export function findCityByName(query: string): BrazilianCityGeo | null {
  if (!query) return null;
  // Clean query removing trailing state hints like " - SP" or " (PR)"
  const cleanQuery = query
    .replace(/\s*[-/]\s*[a-zA-Z]{2}$/, '')
    .replace(/\s*\([a-zA-Z]{2}\)$/, '')
    .trim();

  const normalized = cleanQuery
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Exact match (normalized)
  const exact = BRAZIL_MAJOR_CITIES.find((c) => {
    const nameNorm = c.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return nameNorm === normalized || c.name.toLowerCase() === cleanQuery.toLowerCase();
  });
  if (exact) return exact;

  // 2. Starts with / prefix match
  const startsWithMatch = BRAZIL_MAJOR_CITIES.find((c) => {
    const nameNorm = c.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return nameNorm.startsWith(normalized) || normalized.startsWith(nameNorm);
  });
  if (startsWithMatch) return startsWithMatch;

  // 3. Includes / substring match
  return (
    BRAZIL_MAJOR_CITIES.find((c) => {
      const nameNorm = c.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return nameNorm.includes(normalized) || normalized.includes(nameNorm);
    }) || null
  );
}

/**
 * Calculates geodesic Great Circle distance and estimated flight time between two Brazilian cities
 */
export function calculateCityRouteDistance(
  originQuery: string,
  destinationQuery: string
): {
  origin: BrazilianCityGeo;
  destination: BrazilianCityGeo;
  distanceKm: number;
  flightHours: number;
} | null {
  const origin = findCityByName(originQuery);
  const destination = findCityByName(destinationQuery);
  if (!origin || !destination) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);
  const flightHours = Number((distanceKm / 780 + 0.35).toFixed(1));

  return { origin, destination, distanceKm, flightHours };
}

/**
 * Search city by name with optional fallback to Nominatim / OpenStreetMap
 */
const nominatimCache = new Map<string, BrazilianCityGeo | null>();
const nominatimInFlight = new Map<string, Promise<BrazilianCityGeo | null>>();

export async function resolveCityCoordinates(cityName: string, ufHint?: string): Promise<BrazilianCityGeo | null> {
  // First check local catalog
  const query = cityName.toLowerCase().trim();
  const local = BRAZIL_MAJOR_CITIES.find(
    (c) =>
      c.name.toLowerCase() === query ||
      (ufHint && c.name.toLowerCase() === query && c.uf.toLowerCase() === ufHint.toLowerCase())
  );
  if (local) return local;

  const cacheKey = `${query}_${(ufHint || '').toLowerCase()}`;
  if (nominatimCache.has(cacheKey)) {
    return nominatimCache.get(cacheKey) || null;
  }

  if (nominatimInFlight.has(cacheKey)) {
    return nominatimInFlight.get(cacheKey)!;
  }

  const promise = (async () => {
    // Fallback to open geocoder Nominatim with timeout and cache
    try {
      const q = encodeURIComponent(`${cityName} ${ufHint || ''} Brasil`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q=${q}`, {
        headers: {
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const result: BrazilianCityGeo = {
            id: `custom-${Date.now()}`,
            name: item.name || cityName,
            uf: ufHint?.toUpperCase() || 'BR',
            region: 'Sudeste',
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          };
          nominatimCache.set(cacheKey, result);
          return result;
        }
      }
      nominatimCache.set(cacheKey, null);
    } catch (err) {
      console.warn('Geocoder fallback failed:', err);
      nominatimCache.set(cacheKey, null);
    } finally {
      nominatimInFlight.delete(cacheKey);
    }

    return null;
  })();

  nominatimInFlight.set(cacheKey, promise);
  return promise;
}
