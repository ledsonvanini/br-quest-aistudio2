import { AppMainMode } from '../../types';

export interface OceanEngineConfig {
  /** Velocidade geral de animação das ondas e marolas (default: 1.0) */
  waveSpeed: number;
  /** Escala/amplitude vertical das ondulações (default: 1.0) */
  waveScale: number;
  /** Intensidade e frequência das micro-marolas / ripples (default: 1.0) */
  marolasIntensity: number;
  /** Ativação do sistema de bolhas e efervescência marinha (default: true) */
  bubblesEnabled: boolean;
  /** Densidade/taxa de geração de bolhas (default: 1.0) */
  bubblesDensity: number;
  /** Ativação das marolas de arrebentação costeira (default: true) */
  coastalSurfEnabled: boolean;
  /** Ativação da exibição das correntes marítimas do Atlântico (default: true) */
  correntesEnabled: boolean;
  /** Modo temático visual atual da aplicação */
  mode: AppMainMode;
  /** Cor da água oceânica profunda (opcional, calculada a partir do modo se omitida) */
  deepWaterColor?: string;
  /** Cor das águas rasas costeiras e recifes (opcional) */
  shallowWaterColor?: string;
  /** Cor do reflexo solar especular nas marolas (opcional) */
  specularGlintColor?: string;
}

export interface OceanBubble {
  id: number;
  x: number;
  y: number;
  /** Profundidade Z (0 = superfície, 1 = fundo oceânico) */
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  /** Fase para oscilação lateral senoidal (wobble) */
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  life: number;
  maxLife: number;
  /** Se a bolha atingiu a superfície e está em tensão/estouro */
  isAtSurface: boolean;
  surfaceTimer: number;
  isPopped: boolean;
}

export interface OceanMarola {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  speed: number;
  alpha: number;
  type: 'coastal_surf' | 'bubble_burst' | 'island_reef' | 'open_swell' | 'interaction';
  color?: string;
}

export interface OceanSwellFront {
  id: number;
  x: number;
  y: number;
  length: number;
  width: number;
  speed: number;
  angle: number;
  phase: number;
  depth: number;
  crestAlpha: number;
}

export interface OceanSurfParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface OceanicIslandSpec {
  name: string;
  geo: [number, number];
  radius: number;
  depthColor: string;
  shallowColor: string;
}

export interface OceanCurrentSpec {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}
