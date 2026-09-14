import React, { useEffect, useRef } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';

interface AtmosphericCloudsLayerProps {
  enabled?: boolean;
  speedMultiplier?: number;
}

interface CloudParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  targetOpacity: number;
  imageIndex: number;
  width: number;
  height: number;
  altitude: number;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

// Ultra-wide boundless canvas coverage exceeding stage and ocean boundaries to eliminate edge masks
const CLOUD_CANVAS_WIDTH = 5120;
const CLOUD_CANVAS_HEIGHT = 3600;

export const AtmosphericCloudsLayer: React.FC<AtmosphericCloudsLayerProps> = ({
  enabled = true,
  speedMultiplier = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const w = CLOUD_CANVAS_WIDTH;
    const h = CLOUD_CANVAS_HEIGHT;

    // Pre-bake 3 distinct high-res cumulus cloud textures in offscreen buffers
    const cachedSprites: HTMLCanvasElement[] = [];
    const cachedShadows: HTMLCanvasElement[] = [];

    for (let s = 0; s < 3; s++) {
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 360;
      spriteCanvas.height = 200;
      const sCtx = spriteCanvas.getContext('2d');

      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 360;
      shadowCanvas.height = 200;
      const shCtx = shadowCanvas.getContext('2d');

      if (sCtx && shCtx) {
        const cx = 180;
        const cy = 100;

        const puffConfigs = [
          [
            { ox: 0, oy: 0, r: 65 },
            { ox: -60, oy: 12, r: 52 },
            { ox: 60, oy: 8, r: 54 },
            { ox: -105, oy: 24, r: 38 },
            { ox: 105, oy: 22, r: 38 },
            { ox: -25, oy: -22, r: 46 },
            { ox: 30, oy: -20, r: 48 },
          ],
          [
            { ox: -10, oy: -5, r: 70 },
            { ox: -75, oy: 10, r: 46 },
            { ox: 45, oy: 12, r: 55 },
            { ox: 100, oy: 20, r: 40 },
            { ox: -115, oy: 22, r: 34 },
            { ox: 18, oy: -26, r: 44 },
            { ox: -45, oy: -18, r: 42 },
          ],
          [
            { ox: 12, oy: -8, r: 64 },
            { ox: -45, oy: 8, r: 58 },
            { ox: 75, oy: 12, r: 48 },
            { ox: -95, oy: 20, r: 40 },
            { ox: 115, oy: 24, r: 34 },
            { ox: -12, oy: -24, r: 48 },
            { ox: 40, oy: -22, r: 44 },
          ],
        ][s];

        // Draw Lit Cloud Sprite
        puffConfigs.forEach((p) => {
          const grad = sCtx.createRadialGradient(
            cx + p.ox,
            cy + p.oy - p.r * 0.35,
            p.r * 0.1,
            cx + p.ox,
            cy + p.oy,
            p.r
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          grad.addColorStop(0.55, 'rgba(240, 248, 255, 0.88)');
          grad.addColorStop(0.85, 'rgba(215, 230, 250, 0.55)');
          grad.addColorStop(1, 'rgba(180, 205, 235, 0)');
          sCtx.fillStyle = grad;
          sCtx.beginPath();
          sCtx.arc(cx + p.ox, cy + p.oy, p.r, 0, Math.PI * 2);
          sCtx.fill();
        });

        // Draw Soft Pre-baked Shadow
        puffConfigs.forEach((p) => {
          const shGrad = shCtx.createRadialGradient(
            cx + p.ox,
            cy + p.oy,
            p.r * 0.2,
            cx + p.ox,
            cy + p.oy,
            p.r * 1.05
          );
          shGrad.addColorStop(0, 'rgba(2, 8, 20, 0.55)');
          shGrad.addColorStop(0.6, 'rgba(2, 8, 20, 0.2)');
          shGrad.addColorStop(1, 'rgba(2, 8, 20, 0)');
          shCtx.fillStyle = shGrad;
          shCtx.beginPath();
          shCtx.arc(cx + p.ox, cy + p.oy, p.r * 1.05, 0, Math.PI * 2);
          shCtx.fill();
        });
      }

      cachedSprites.push(spriteCanvas);
      cachedShadows.push(shadowCanvas);
    }

    // High performance cloud pool (14 balanced clouds across Brazil and Atlantic)
    const CLOUD_COUNT = 14;
    const clouds: CloudParticle[] = [];

    const createCloud = (initialSpawn = false): CloudParticle => {
      const imgIdx = Math.floor(Math.random() * 3);
      const isMirrored = Math.random() < 0.5;
      const baseScale = 0.65 + Math.random() * 0.95;
      const altitude = 1 + Math.random() * 2;

      const baseSpeed = (0.28 + (3.5 - altitude) * 0.16 + Math.random() * 0.14) * speedMultiplier;
      const windAngle = Math.PI * 0.95 + (Math.random() - 0.5) * 0.15;

      const cloudW = 340 * baseScale;
      const cloudH = 190 * baseScale;

      let startX: number;
      let startY: number;

      if (initialSpawn) {
        startX = Math.random() * (w * 1.1) - w * 0.05;
        startY = Math.random() * (h * 0.95);
      } else {
        startX = w + 120 + Math.random() * 350;
        startY = Math.random() * (h * 0.88);
      }

      const targetOpacity = 0.35 + Math.random() * 0.45;

      return {
        id: Math.random(),
        x: startX,
        y: startY,
        vx: Math.cos(windAngle) * baseSpeed,
        vy: Math.sin(windAngle) * baseSpeed,
        scaleX: (isMirrored ? -1 : 1) * baseScale,
        scaleY: baseScale,
        opacity: initialSpawn ? targetOpacity * (0.5 + Math.random() * 0.5) : 0,
        targetOpacity,
        imageIndex: imgIdx,
        width: cloudW,
        height: cloudH,
        altitude,
        rotation: (Math.random() - 0.5) * 0.06,
        vRot: (Math.random() - 0.5) * 0.0001,
        life: 0,
        maxLife: 4500 + Math.random() * 5000,
        shadowOffsetX: (24 + altitude * 14) * baseScale,
        shadowOffsetY: (32 + altitude * 18) * baseScale,
      };
    };

    for (let i = 0; i < CLOUD_COUNT; i++) {
      clouds.push(createCloud(true));
    }

    let animId: number;
    let lastRenderTime = performance.now();
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS para nuvens é extremamente suave e economiza 50% de processamento

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      const elapsed = now - lastRenderTime;
      if (elapsed < FRAME_INTERVAL) {
        return;
      }
      const timeScale = Math.min(elapsed / 16.666, 3.0);
      lastRenderTime = now - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, w, h);

      for (let i = clouds.length - 1; i >= 0; i--) {
        const c = clouds[i];
        c.life += timeScale;

        c.x += c.vx * speedMultiplier * timeScale;
        c.y += c.vy * speedMultiplier * timeScale;
        c.rotation += c.vRot * timeScale;

        if (c.opacity < c.targetOpacity) {
          c.opacity = Math.min(c.targetOpacity, c.opacity + 0.008 * timeScale);
        }

        if (c.x < -c.width - 250 || c.y > h + 250 || c.y < -250 || c.life > c.maxLife) {
          clouds.splice(i, 1);
          clouds.push(createCloud(false));
          continue;
        }

        const sprite = cachedSprites[c.imageIndex];
        const shadow = cachedShadows[c.imageIndex];

        // 1. Soft Relief Shadow
        ctx.save();
        ctx.translate(c.x + c.shadowOffsetX, c.y + c.shadowOffsetY);
        ctx.rotate(c.rotation);
        ctx.scale(c.scaleX, c.scaleY);
        ctx.globalAlpha = c.opacity * 0.22;
        ctx.drawImage(shadow, -180, -100, 360, 200);
        ctx.restore();

        // 2. High-Altitude Cumulus Cloud
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.scale(c.scaleX, c.scaleY);
        ctx.globalAlpha = c.opacity;
        ctx.drawImage(sprite, -180, -100, 360, 200);
        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled, speedMultiplier]);

  if (!enabled) return null;

  return (
    <div
      className="camada-nuvens-atmosfericas-wrapper absolute pointer-events-none overflow-visible will-change-transform"
      style={{
        width: CLOUD_CANVAS_WIDTH,
        height: CLOUD_CANVAS_HEIGHT,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) translateZ(95px)',
        transformStyle: 'preserve-3d',
        zIndex: 50,
      }}
    >
      <canvas
        ref={canvasRef}
        width={CLOUD_CANVAS_WIDTH}
        height={CLOUD_CANVAS_HEIGHT}
        className="camada-nuvens-spawner-canvas absolute inset-0 pointer-events-none"
        style={{
          width: CLOUD_CANVAS_WIDTH,
          height: CLOUD_CANVAS_HEIGHT,
        }}
      />
    </div>
  );
};
