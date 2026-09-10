/**
 * Dados Didáticos e Astrofísicos dos Marcos Astronômicos da Órbita Terrestre
 * Explicações científicas sobre solstícios, equinócios, periélio e afélio.
 */

export interface AstronomicalMilestone {
  id: string;
  label: string;
  dateStr: string;
  day: number;
  icon: string;
  seasonName: string;
  axialTiltExplanation: string;
  brazilSolarEffect: string;
  declination: string;
}

export const ASTRONOMICAL_MILESTONES: AstronomicalMilestone[] = [
  {
    id: 'solsticio-verao',
    label: 'Solstício de Verão',
    dateStr: '21 de Dezembro',
    day: 355,
    icon: '☀️',
    seasonName: 'Verão no Brasil',
    axialTiltExplanation: 'O Hemisfério Sul inclina-se 23,44° diretamente em direção ao Sol. O astro-rei atinge o zênite (sol a pino) sobre o Trópico de Capricórnio.',
    brazilSolarEffect: 'Máxima incidência solar no Brasil: o dia mais longo do ano (até 14h de luz no Sul) e as noites mais curtas.',
    declination: '-23,44° Sul',
  },
  {
    id: 'equinocio-outono',
    label: 'Equinócio de Outono',
    dateStr: '20 de Março',
    day: 79,
    icon: '🍂',
    seasonName: 'Outono no Brasil',
    axialTiltExplanation: 'O eixo terrestre fica perpendicular aos raios solares. O terminador dia/noite cruza exatamente os polos Norte e Sul.',
    brazilSolarEffect: 'Equilíbrio solar perfeito: o dia e a noite têm exatamente a mesma duração (12h de dia e 12h de noite) em todo o território nacional.',
    declination: '0,0° (Equador)',
  },
  {
    id: 'solsticio-inverno',
    label: 'Solstício de Inverno',
    dateStr: '21 de Junho',
    day: 172,
    icon: '❄️',
    seasonName: 'Inverno no Brasil',
    axialTiltExplanation: 'O Hemisfério Sul inclina-se 23,44° para longe do Sol. O zênite solar desloca-se para o Trópico de Câncer no Hemisfério Norte.',
    brazilSolarEffect: 'Mínima incidência de calor no Brasil: dia mais curto do ano e noites mais longas, com temperaturas mais amenas.',
    declination: '+23,44° Norte',
  },
  {
    id: 'equinocio-primavera',
    label: 'Equinócio de Primavera',
    dateStr: '22 de Setembro',
    day: 265,
    icon: '🌸',
    seasonName: 'Primavera no Brasil',
    axialTiltExplanation: 'A Terra volta à posição orbital em que ambos os hemisférios recebem incidência idêntica de radiação solar.',
    brazilSolarEffect: 'Transição climática: dias e noites voltam a ter 12h de duração, aumentando progressivamente a insolação e o desabrochar das flores.',
    declination: '0,0° (Equador)',
  },
  {
    id: 'perielio',
    label: 'Periélio Terrestre',
    dateStr: '03 de Janeiro',
    day: 3,
    icon: '🔥',
    seasonName: 'Máxima Proximidade',
    axialTiltExplanation: 'Ponto da órbita elíptica em que a Terra atinge sua distância mínima em relação ao Sol (~147,1 milhões de km).',
    brazilSolarEffect: 'Maior atração gravitacional e velocidade de translação orbital máxima (30,29 km/s segundo a 2ª Lei de Kepler).',
    declination: '-22,8° Sul',
  },
  {
    id: 'afelio',
    label: 'Afélio Terrestre',
    dateStr: '04 de Julho',
    day: 185,
    icon: '🧊',
    seasonName: 'Maior Afastamento',
    axialTiltExplanation: 'Ponto da órbita elíptica em que a Terra atinge seu maior afastamento do Sol (~152,1 milhões de km).',
    brazilSolarEffect: 'Menor atração gravitacional e menor velocidade de translação orbital (29,29 km/s segundo a 2ª Lei de Kepler).',
    declination: '+22,9° Norte',
  },
];
