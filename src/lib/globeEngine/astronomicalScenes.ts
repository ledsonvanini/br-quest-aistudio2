/**
 * Pre-defined Astronomical Scenes & Views (Cenas Pré-Definidas)
 * Standardized camera configurations for observing Earth, Brazil,
 * the Heliocentric Solar System, Planetary Alignments, and Solstices.
 */
import * as THREE from 'three';

export interface AstronomicalScenePreset {
  id: string;
  name: string;
  shortLabel: string;
  category: 'padrao' | 'heliocentrico' | 'solsticio' | 'equinocio' | 'planetas';
  icon: string;
  badge: string;
  description: string;
  focusMode: 'earth' | 'sun';
  targetDayOfYear?: number;
  alignPlanets?: boolean;
  camOffset: { x: number; y: number; z: number };
  lookTarget: { x: number; y: number; z: number };
  durationMs: number;
}

export const ASTRONOMICAL_SCENE_PRESETS: AstronomicalScenePreset[] = [
  {
    id: 'sistema-ortogonal',
    name: 'Sistema Completo (Ortogonal)',
    shortLabel: 'Sistema Ortogonal',
    category: 'heliocentrico',
    icon: '☀️',
    badge: 'Visão Zenital',
    description: 'Visão zenital perpendicular (top-down) sobre o Sol e todos os 8 planetas com órbitas coplanares concêntricas.',
    focusMode: 'sun',
    camOffset: { x: 0, y: 240, z: 24 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1600,
    alignPlanets: false,
  },
  {
    id: 'terra-lua',
    name: 'Foco na Terra e Lua',
    shortLabel: 'Terra e Lua',
    category: 'heliocentrico',
    icon: '🌍',
    badge: 'Foco Binário',
    description: 'Enquadramento aproximado destacando a Terra e a órbita da Lua em proporção e separação geométrica precisa.',
    focusMode: 'earth',
    camOffset: { x: 4.5, y: 2.8, z: 8.5 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1400,
    alignPlanets: false,
  },
  {
    id: 'alinhamento-astros',
    name: 'Alinhamento dos Astros',
    shortLabel: 'Alinhamento',
    category: 'heliocentrico',
    icon: '📐',
    badge: 'Sizígia Cósmica',
    description: 'Alinhamento de todos os planetas em linha radial observados em perspectiva cinematográfica a partir do Sol.',
    focusMode: 'sun',
    alignPlanets: true,
    camOffset: { x: -18, y: 16, z: 36 },
    lookTarget: { x: 45, y: 0, z: 0 },
    durationMs: 1800,
  },
  {
    id: 'eclipse-solar',
    name: 'Visão de Eclipse Solar',
    shortLabel: 'Eclipse Solar',
    category: 'heliocentrico',
    icon: '🌑',
    badge: 'Alinhamento Sol-Lua-Terra',
    description: 'Perspectiva na linha de visada Sol-Lua-Terra, observando o alinhamento da Lua frente ao disco do Sol.',
    focusMode: 'earth',
    camOffset: { x: 2.4, y: 0.2, z: 1.8 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1500,
    alignPlanets: false,
  },
  {
    id: 'foco-brasil',
    name: 'Foco no Brasil (Padrão)',
    shortLabel: 'Foco no Brasil',
    category: 'padrao',
    icon: '🇧🇷',
    badge: 'Padrão Inicial',
    description: 'Visão padrão com a Terra estática e o mapa do Brasil e América do Sul em alta nitidez no centro da tela.',
    focusMode: 'earth',
    camOffset: { x: 3.5, y: -1.4, z: 4.3 }, // Centered on Brazil
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1300,
  },
  {
    id: 'heliocentrico-geral',
    name: 'Sistema Solar Heliocêntrico',
    shortLabel: 'Sistema Solar',
    category: 'heliocentrico',
    icon: '☀️',
    badge: 'Astrofísica Real',
    description: 'Perspectiva panorâmica elevada acima do plano orbital mostrando o Sol no centro e todos os 8 planetas e órbitas coplanares.',
    focusMode: 'sun',
    camOffset: { x: 45, y: 75, z: 120 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1600,
  },
  {
    id: 'solsticio-verao',
    name: 'Solstício de Verão no Brasil (21/Dez)',
    shortLabel: 'Solstício Verão',
    category: 'solsticio',
    icon: '☀️',
    badge: '21 de Dezembro',
    description: 'Máxima insolação no Brasil sobre o Trópico de Capricórnio (dias mais longos do ano no território nacional).',
    focusMode: 'earth',
    targetDayOfYear: 355,
    alignPlanets: false,
    camOffset: { x: 5.2, y: -2.6, z: 6.8 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1500,
  },
  {
    id: 'solsticio-inverno',
    name: 'Solstício de Inverno no Brasil (21/Jun)',
    shortLabel: 'Solstício Inverno',
    category: 'solsticio',
    icon: '❄️',
    badge: '21 de Junho',
    description: 'Hemisfério Norte inclinado para o Sol; noites mais longas do ano e menor incidência angular de calor no Brasil.',
    focusMode: 'earth',
    targetDayOfYear: 172,
    alignPlanets: false,
    camOffset: { x: 5.2, y: 3.2, z: 6.8 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1500,
  },
  {
    id: 'equinocio-outono',
    name: 'Equinócio de Outono (20/Mar)',
    shortLabel: 'Equinócio Outono',
    category: 'equinocio',
    icon: '🍂',
    badge: '20 de Março',
    description: 'Sol a pino no Equador; 12 horas de dia e 12 horas de noite com iluminação homogênea sobre o Brasil.',
    focusMode: 'earth',
    targetDayOfYear: 79,
    alignPlanets: false,
    camOffset: { x: 5.8, y: 0.2, z: 6.5 },
    lookTarget: { x: 0, y: 0, z: 0 },
    durationMs: 1500,
  },
  {
    id: 'gigantes-gasosos',
    name: 'Gigantes do Sistema (Júpiter & Saturno)',
    shortLabel: 'Júpiter & Saturno',
    category: 'planetas',
    icon: '🪐',
    badge: 'Mundos Exteriores',
    description: 'Perspectiva focada além do Cinturão de Asteroides, destacando Júpiter e os anéis concêntricos de Saturno.',
    focusMode: 'sun',
    camOffset: { x: 55, y: 32, z: 85 },
    lookTarget: { x: 95, y: 0, z: 0 },
    durationMs: 1600,
  },
];
