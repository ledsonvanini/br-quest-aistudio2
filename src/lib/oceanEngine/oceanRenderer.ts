import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../mapProjections';
import { getOceanThemePalette } from './oceanMath';
import { OceanSimulationEngine } from './oceanSimulation';

export class OceanRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private sim: OceanSimulationEngine;

  constructor(canvas: HTMLCanvasElement, sim: OceanSimulationEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sim = sim;
  }

  public render() {
    const ctx = this.ctx;
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;
    const cfg = this.sim.getConfig();
    const time = this.sim.getTime();
    const palette = getOceanThemePalette(cfg.mode);

    ctx.clearRect(0, 0, w, h);

    // =========================================================================
    // 1. CORRENTES MARÍTIMAS DO ATLÂNTICO SUL (STREAMLINES & BADGES)
    // =========================================================================
    if (cfg.correntesEnabled) {
      this.renderCurrents(ctx, time);
    }

    // =========================================================================
    // 2. FRENTES VOLUMÉTRICAS DE ONDULAÇÃO (OCEAN SWELLS & CRISTAS DE ESPUMA)
    // =========================================================================
    this.renderSwells(ctx, time, cfg.waveScale, palette);

    // =========================================================================
    // 3. ARREBENTAÇÃO COSTEIRA MULTICAMADA (COASTAL SURF & ESPRAIAMENTO)
    // =========================================================================
    if (cfg.coastalSurfEnabled) {
      this.renderCoastalSurf(ctx, time, palette);
    }

    // =========================================================================
    // 4. MAROLAS E ONDULAÇÕES CONCÊNTRICAS (RIPPLES & REEF RINGS)
    // =========================================================================
    if (cfg.marolasIntensity > 0) {
      this.renderMarolas(ctx, palette);
    }

    // =========================================================================
    // 5. BOLHAS MARINHAS SUBMARINAS E NA SUPERFÍCIE (BUBBLES & TENSÃO)
    // =========================================================================
    if (cfg.bubblesEnabled) {
      this.renderBubbles(ctx, time, palette);
    }

    // =========================================================================
    // 6. GOTÍCULAS E SPRAY DA ARREBENTAÇÃO
    // =========================================================================
    if (cfg.coastalSurfEnabled) {
      this.renderSurfSpray(ctx);
    }

    // =========================================================================
    // 7. ARQUIPÉLAGOS E LAGOAS DE RECIFES OCEÂNICOS
    // =========================================================================
    this.renderIslandsAndReefs(ctx, time);
  }

  private renderCurrents(ctx: CanvasRenderingContext2D, time: number) {
    const currents = this.sim.getCurrents();

    currents.forEach((curr, idx) => {
      const pulse = (Math.sin(time * 1.5 + idx) + 1) / 2;
      const arrowLen = 38 + pulse * 10;
      const angle = Math.atan2(curr.vy, curr.vx);

      ctx.save();
      ctx.translate(curr.x, curr.y);
      ctx.rotate(angle);

      // Linha tracejada de corrente hidrodinâmica
      ctx.strokeStyle = curr.color;
      ctx.lineWidth = 2.0;
      ctx.setLineDash([7, 4]);
      ctx.lineDashOffset = -time * 26;
      ctx.beginPath();
      ctx.moveTo(-arrowLen, 0);
      ctx.lineTo(arrowLen, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ponta direcional de flecha de fluxo
      ctx.fillStyle = curr.color;
      ctx.beginPath();
      ctx.moveTo(arrowLen + 6, 0);
      ctx.lineTo(arrowLen - 6, -5);
      ctx.lineTo(arrowLen - 3, 0);
      ctx.lineTo(arrowLen - 6, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Crachá legível de identificação da corrente
      ctx.save();
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(curr.name);
      const textW = textMetrics.width;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
      ctx.beginPath();
      ctx.roundRect(curr.x - textW / 2 - 8, curr.y - 25, textW + 16, 20, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#7dd3fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(curr.name, curr.x, curr.y - 15);
      ctx.restore();
    });
  }

  private renderSwells(
    ctx: CanvasRenderingContext2D,
    time: number,
    scale: number,
    palette: ReturnType<typeof getOceanThemePalette>
  ) {
    const swells = this.sim.getSwells();

    swells.forEach((sw) => {
      const swellCycle = Math.sin(time * 1.4 + sw.phase);
      if (swellCycle < -0.25) return;

      const swellAmp = Math.max(0, swellCycle) * scale;
      const distAdvance = (time * sw.speed * 24) % 190;
      const swellX = sw.x + Math.cos(sw.angle) * distAdvance;
      const swellY = sw.y + Math.sin(sw.angle) * distAdvance;

      ctx.save();
      ctx.translate(swellX, swellY);
      ctx.rotate(sw.angle + Math.PI / 2);

      // Corpo volumétrico da onda sombreado
      const waveBodyGrad = ctx.createLinearGradient(0, -sw.width * 0.5, 0, sw.width * 0.5);
      waveBodyGrad.addColorStop(0, `rgba(2, 132, 199, ${swellAmp * 0.05})`);
      waveBodyGrad.addColorStop(0.45, `rgba(14, 165, 233, ${swellAmp * 0.45})`);
      waveBodyGrad.addColorStop(0.55, `rgba(56, 189, 248, ${swellAmp * 0.65})`);
      waveBodyGrad.addColorStop(1, `rgba(2, 132, 199, ${swellAmp * 0.1})`);

      ctx.fillStyle = waveBodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, sw.length * 0.5, sw.width * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crista luminosa de espuma
      ctx.strokeStyle = palette.foamCrest;
      ctx.globalAlpha = swellAmp * sw.crestAlpha;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, sw.width * 0.08, sw.length * 0.44, Math.PI * 0.15, Math.PI * 0.85, false);
      ctx.stroke();

      // Rastro secundário de marola de ré
      if (swellAmp > 0.55) {
        ctx.strokeStyle = palette.specular;
        ctx.globalAlpha = (swellAmp - 0.55) * 0.7;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, sw.width * 0.25, sw.length * 0.3, Math.PI * 0.2, Math.PI * 0.8, false);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  private renderCoastalSurf(
    ctx: CanvasRenderingContext2D,
    time: number,
    palette: ReturnType<typeof getOceanThemePalette>
  ) {
    const coastPts = this.sim.getCoastPoints();
    if (coastPts.length === 0) return;

    // 4 faixas de arrebentação avançando em direção à praia
    for (let layer = 1; layer <= 4; layer++) {
      const layerPulse = time * 1.6 + layer * 1.35;
      const progress = (Math.sin(layerPulse) + 1) / 2;
      const distOffshore = 6 + progress * 28;
      const opacity = (1 - progress * 0.85) * 0.85;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      coastPts.forEach((pt, i) => {
        const waveX = pt.x + pt.nx * distOffshore;
        const waveY = pt.y + pt.ny * distOffshore;

        if (i === 0) {
          ctx.moveTo(waveX, waveY);
        } else {
          const prev = coastPts[i - 1];
          const prevX = prev.x + prev.nx * distOffshore;
          const prevY = prev.y + prev.ny * distOffshore;
          const cx = (prevX + waveX) / 2;
          const cy = (prevY + waveY) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cx, cy);
        }
      });

      // 1. Lençol raso turquesa
      ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.55})`;
      ctx.lineWidth = 5.0;
      ctx.stroke();

      // 2. Crista de espuma branca de quebra
      ctx.strokeStyle = palette.foamCrest;
      ctx.globalAlpha = opacity * 0.95;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // 3. Espuma rendada junto à areia na camada de praia
      if (layer === 1) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private renderMarolas(
    ctx: CanvasRenderingContext2D,
    palette: ReturnType<typeof getOceanThemePalette>
  ) {
    const marolas = this.sim.getMarolas();

    marolas.forEach((m) => {
      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.strokeStyle = m.color || palette.specular;
      ctx.lineWidth = m.type === 'interaction' ? 2.2 : 1.4;

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Anel secundário concêntrico para marolas mais enérgicas
      if (m.radius > 8) {
        ctx.strokeStyle = palette.foamCrest;
        ctx.globalAlpha = m.alpha * 0.4;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  private renderBubbles(
    ctx: CanvasRenderingContext2D,
    time: number,
    palette: ReturnType<typeof getOceanThemePalette>
  ) {
    const bubbles = this.sim.getBubbles();

    bubbles.forEach((b) => {
      ctx.save();
      const currentRadius = b.radius * (1 - b.z * 0.35); // Bolhas mais fundas parecem menores
      const alpha = b.opacity * (1 - b.z * 0.45);

      ctx.globalAlpha = alpha;

      // 1. Corpo translúcido da bolha com gradiente de profundidade
      const bubbleGrad = ctx.createRadialGradient(
        b.x - currentRadius * 0.3,
        b.y - currentRadius * 0.3,
        currentRadius * 0.1,
        b.x,
        b.y,
        currentRadius
      );
      bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      bubbleGrad.addColorStop(0.5, palette.bubbleColor);
      bubbleGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.3)');
      bubbleGrad.addColorStop(1, 'rgba(2, 132, 199, 0.7)');

      ctx.fillStyle = bubbleGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Borda de tensão superficial
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 3. Brilho especular (ponto de luz solar refletido no topo esquerdo)
      ctx.fillStyle = palette.bubbleHighlight;
      ctx.beginPath();
      ctx.arc(
        b.x - currentRadius * 0.35,
        b.y - currentRadius * 0.35,
        currentRadius * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Se estiver na superfície, anel sutil de estiramento
      if (b.isAtSurface) {
        ctx.strokeStyle = palette.specular;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius * 1.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  private renderSurfSpray(ctx: CanvasRenderingContext2D) {
    const particles = this.sim.getSurfParticles();

    particles.forEach((p) => {
      const progress = p.life / p.maxLife;
      const currentAlpha = p.alpha * (1 - progress);

      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  private renderIslandsAndReefs(ctx: CanvasRenderingContext2D, time: number) {
    const islands = this.sim.getIslands();

    islands.forEach((isl) => {
      const pulse = (Math.sin(time * 2.2) + 1) / 2;
      const lagoonRadius = isl.spec.radius * 2.4;

      // Lagoa do recife com brilho turquesa translúcido
      const lagoonGrad = ctx.createRadialGradient(isl.x, isl.y, 2, isl.x, isl.y, lagoonRadius);
      lagoonGrad.addColorStop(0, 'rgba(34, 211, 238, 0.75)');
      lagoonGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.45)');
      lagoonGrad.addColorStop(0.8, 'rgba(2, 132, 199, 0.2)');
      lagoonGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

      ctx.fillStyle = lagoonGrad;
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, lagoonRadius, 0, Math.PI * 2);
      ctx.fill();

      // 1º anel de arrebentação de recife
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + pulse * 0.45})`;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, isl.spec.radius + pulse * 10, 0, Math.PI * 2);
      ctx.stroke();

      // 2º anel exterior de marola
      const outerPulse = (Math.sin(time * 2.2 + 1.2) + 1) / 2;
      ctx.strokeStyle = `rgba(207, 250, 254, ${(1 - outerPulse) * 0.5})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, isl.spec.radius * 1.5 + outerPulse * 12, 0, Math.PI * 2);
      ctx.stroke();

      // Crachá de identificação da ilha oceânica
      ctx.save();
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(isl.spec.name);
      const textW = textMetrics.width;

      const badgeX = isl.x + isl.spec.radius + 8;
      const badgeY = isl.y - 9;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
      ctx.beginPath();
      ctx.roundRect(badgeX - 6, badgeY - 3, textW + 12, 20, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#f0f9ff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(isl.spec.name, badgeX, badgeY + 7);
      ctx.restore();
    });
  }
}
