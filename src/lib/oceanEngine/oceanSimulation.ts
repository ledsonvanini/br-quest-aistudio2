import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, createBrazilMercatorProjection } from '../mapProjections';
import {
  calculateProjectedCoastPoints,
  ProjectedCoastPoint,
  OCEAN_ISLANDS_SPECS,
  OCEAN_CURRENTS_SPECS,
} from './oceanMath';
import {
  OceanBubble,
  OceanEngineConfig,
  OceanMarola,
  OceanSwellFront,
  OceanSurfParticle,
  OceanicIslandSpec,
  OceanCurrentSpec,
} from './types';

export class OceanSimulationEngine {
  private config: OceanEngineConfig;
  private coastPoints: ProjectedCoastPoint[] = [];
  private islands: { spec: OceanicIslandSpec; x: number; y: number }[] = [];
  private currents: OceanCurrentSpec[] = [];

  private bubbles: OceanBubble[] = [];
  private marolas: OceanMarola[] = [];
  private swells: OceanSwellFront[] = [];
  private surfParticles: OceanSurfParticle[] = [];

  private nextEntityId = 1;
  private time = 0;
  private bubbleSpawnTimer = 0;
  private readonly maxBubbles = 65;
  private readonly maxMarolas = 40;
  private readonly maxSurfParticles = 50;

  constructor(initialConfig?: Partial<OceanEngineConfig>) {
    this.config = {
      waveSpeed: 1.0,
      waveScale: 1.0,
      marolasIntensity: 1.0,
      bubblesEnabled: true,
      bubblesDensity: 1.0,
      coastalSurfEnabled: true,
      correntesEnabled: true,
      mode: 'aventura',
      ...initialConfig,
    };

    this.initGeometry();
    this.initSwells();
    this.initBubblePool();
    this.initSurfParticles();
  }

  private initGeometry() {
    this.coastPoints = calculateProjectedCoastPoints();
    const projection = createBrazilMercatorProjection();

    this.islands = OCEAN_ISLANDS_SPECS.map((spec) => {
      const pt = projection(spec.geo);
      return {
        spec,
        x: pt ? pt[0] : 0,
        y: pt ? pt[1] : 0,
      };
    }).filter((isl) => isl.x > 0);

    this.currents = [...OCEAN_CURRENTS_SPECS];
  }

  private initSwells() {
    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;
    const count = 30;

    this.swells = Array.from({ length: count }, (_, idx) => {
      const isNorth = idx % 2 === 0;
      return {
        id: this.nextEntityId++,
        x: isNorth ? w * 0.60 + Math.random() * (w * 0.38) : w * 0.52 + Math.random() * (w * 0.42),
        y: isNorth ? h * 0.10 + Math.random() * (h * 0.48) : h * 0.48 + Math.random() * (h * 0.48),
        length: 55 + Math.random() * 85,
        width: 14 + Math.random() * 20,
        speed: 0.35 + Math.random() * 0.4,
        angle: isNorth
          ? -Math.PI * 0.78 + (Math.random() - 0.5) * 0.22
          : -Math.PI * 0.68 + (Math.random() - 0.5) * 0.25,
        phase: (idx / count) * Math.PI * 2,
        depth: Math.random(),
        crestAlpha: 0.8 + Math.random() * 0.2,
      };
    });
  }

  private initBubblePool() {
    // Inicializa lote inicial de bolhas distribuídas pela costa e mar aberto
    for (let i = 0; i < 25; i++) {
      this.spawnBubble(true);
    }
  }

  private initSurfParticles() {
    for (let i = 0; i < this.maxSurfParticles; i++) {
      const p = this.createSurfParticle();
      p.life = Math.random() * p.maxLife;
      this.surfParticles.push(p);
    }
  }

  public setConfig(newConfig: Partial<OceanEngineConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): OceanEngineConfig {
    return this.config;
  }

  public getCoastPoints(): ProjectedCoastPoint[] {
    return this.coastPoints;
  }

  public getIslands() {
    return this.islands;
  }

  public getCurrents(): OceanCurrentSpec[] {
    return this.currents;
  }

  public getBubbles(): OceanBubble[] {
    return this.bubbles;
  }

  public getMarolas(): OceanMarola[] {
    return this.marolas;
  }

  public getSwells(): OceanSwellFront[] {
    return this.swells;
  }

  public getSurfParticles(): OceanSurfParticle[] {
    return this.surfParticles;
  }

  public getTime(): number {
    return this.time;
  }

  /**
   * Spawns an underwater bubble that floats to the surface and pops
   */
  public spawnBubble(randomInitialZ = false): OceanBubble | null {
    if (!this.config.bubblesEnabled || this.bubbles.length >= this.maxBubbles) {
      return null;
    }

    let x = 0;
    let y = 0;

    // 65% geram perto da costa ou recifes, 35% em mar aberto
    if (this.coastPoints.length > 0 && Math.random() < 0.65) {
      const coast = this.coastPoints[Math.floor(Math.random() * this.coastPoints.length)];
      const dist = 12 + Math.random() * 85;
      x = coast.x + coast.nx * dist + (Math.random() - 0.5) * 20;
      y = coast.y + coast.ny * dist + (Math.random() - 0.5) * 20;
    } else {
      // Mar aberto atlântico
      x = MAP_CANVAS_WIDTH * 0.55 + Math.random() * (MAP_CANVAS_WIDTH * 0.42);
      y = MAP_CANVAS_HEIGHT * 0.15 + Math.random() * (MAP_CANVAS_HEIGHT * 0.80);
    }

    const radius = 2.0 + Math.random() * 4.5;
    const initialZ = randomInitialZ ? Math.random() * 0.9 : 0.95;

    const bubble: OceanBubble = {
      id: this.nextEntityId++,
      x,
      y,
      z: initialZ,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.5,
      vz: -0.012 - (radius / 6) * 0.015, // Bolhas maiores sobem mais rápido (empuxo)
      radius,
      maxRadius: radius * (1.1 + Math.random() * 0.3),
      opacity: 0.6 + Math.random() * 0.35,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 3.5 + Math.random() * 3.0,
      wobbleAmp: 0.6 + Math.random() * 0.8,
      life: 0,
      maxLife: 180 + Math.random() * 120,
      isAtSurface: false,
      surfaceTimer: 0,
      isPopped: false,
    };

    this.bubbles.push(bubble);
    return bubble;
  }

  /**
   * Spawns a concentric marola / ripple
   */
  public triggerMarola(
    x: number,
    y: number,
    type: OceanMarola['type'] = 'bubble_burst',
    initialRadius = 2,
    maxRadius = 35,
    color?: string
  ) {
    if (this.marolas.length >= this.maxMarolas) {
      this.marolas.shift(); // Remove a marola mais antiga
    }

    this.marolas.push({
      id: this.nextEntityId++,
      x,
      y,
      radius: initialRadius,
      maxRadius,
      amplitude: 1.0,
      speed: 0.8 + Math.random() * 0.6,
      alpha: 0.85,
      type,
      color,
    });
  }

  private createSurfParticle(): OceanSurfParticle {
    if (this.coastPoints.length === 0) {
      return {
        id: this.nextEntityId++,
        x: 1800,
        y: 800,
        vx: 0,
        vy: 0,
        size: 2,
        alpha: 0.5,
        life: 0,
        maxLife: 40,
      };
    }

    const c = this.coastPoints[Math.floor(Math.random() * this.coastPoints.length)];
    const dist = 5 + Math.random() * 20;

    return {
      id: this.nextEntityId++,
      x: c.x + c.nx * dist + (Math.random() - 0.5) * 12,
      y: c.y + c.ny * dist + (Math.random() - 0.5) * 12,
      vx: -c.nx * (0.4 + Math.random() * 0.85),
      vy: -c.ny * (0.4 + Math.random() * 0.85),
      size: 1.2 + Math.random() * 2.4,
      alpha: 0.4 + Math.random() * 0.5,
      life: 0,
      maxLife: 35 + Math.random() * 45,
    };
  }

  /**
   * Atualiza a simulação física em delta segundos
   */
  public update(deltaSec: number = 0.016) {
    const speed = this.config.waveSpeed;
    this.time += deltaSec * speed;

    // 1. Spawner de novas bolhas periódicas
    if (this.config.bubblesEnabled) {
      this.bubbleSpawnTimer += deltaSec * this.config.bubblesDensity;
      if (this.bubbleSpawnTimer >= 0.28) {
        this.bubbleSpawnTimer = 0;
        this.spawnBubble();
      }
    }

    // 2. Atualizar Bolhas (Física com flutuação, wobble e estouro na superfície)
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.life++;

      // Oscilação lateral senoidal física (wobble)
      const wobble = Math.sin(this.time * b.wobbleSpeed + b.wobblePhase) * b.wobbleAmp;
      b.x += b.vx + wobble * 0.3;
      b.y += b.vy;

      if (!b.isAtSurface) {
        b.z += b.vz;
        if (b.z <= 0) {
          // Chegou à superfície!
          b.z = 0;
          b.isAtSurface = true;
          b.surfaceTimer = 0;
        }
      } else {
        // Na superfície, permanece flutuando por um breve instante com tensão superficial
        b.surfaceTimer++;
        if (b.surfaceTimer > 18 + Math.random() * 20) {
          b.isPopped = true;
          // Ao estourar, gera uma marola e pequenas gotículas
          this.triggerMarola(b.x, b.y, 'bubble_burst', b.radius * 0.8, b.radius * 4.5);
          this.bubbles.splice(i, 1);
          continue;
        }
      }

      // Expiração de vida máxima
      if (b.life >= b.maxLife) {
        this.bubbles.splice(i, 1);
      }
    }

    // 3. Atualizar Marolas (Expansão concêntrica e atenuação exponencial)
    for (let i = this.marolas.length - 1; i >= 0; i--) {
      const m = this.marolas[i];
      m.radius += m.speed * speed;
      const progress = m.radius / m.maxRadius;
      m.alpha = Math.max(0, (1 - progress) * (1 - progress * 0.5));

      if (m.radius >= m.maxRadius || m.alpha <= 0.02) {
        this.marolas.splice(i, 1);
      }
    }

    // 4. Atualizar Gotículas e Espuma de Arrebentação
    if (this.config.coastalSurfEnabled) {
      for (let i = 0; i < this.surfParticles.length; i++) {
        const p = this.surfParticles[i];
        p.life++;
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        if (p.life >= p.maxLife) {
          this.surfParticles[i] = this.createSurfParticle();
        }
      }
    }
  }
}
