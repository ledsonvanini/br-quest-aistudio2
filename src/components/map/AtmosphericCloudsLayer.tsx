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
  scaleX: number; // For horizontal mirroring (-1 or 1) * scale
  scaleY: number;
  opacity: number;
  targetOpacity: number;
  imageIndex: number;
  width: number;
  height: number;
  altitude: number; // 1 (low, fast) to 3 (high, slow)
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export const AtmosphericCloudsLayer: React.FC<AtmosphericCloudsLayerProps> = ({
  enabled = true,
  speedMultiplier = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // Load cloud sprites from /imgSuport/ or prepare procedural offscreen fallback textures
    const cloudImageSources = [
      '/imgSuport/cloud1.png',
      '/imgSuport/cloud2.png',
      '/imgSuport/cloud3.png',
    ];

    // Pre-bake 3 distinct high-res cumulus cloud textures in offscreen buffers
    const cachedSprites: HTMLCanvasElement[] = [];
    const cachedShadows: HTMLCanvasElement[] = [];

    for (let s = 0; s < 3; s++) {
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 380;
      spriteCanvas.height = 220;
      const sCtx = spriteCanvas.getContext('2d');

      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 380;
      shadowCanvas.height = 220;
      const shCtx = shadowCanvas.getContext('2d');

      if (sCtx && shCtx) {
        const cx = 190;
        const cy = 110;
        
        // Distinct puff configurations per cloud type
        const puffConfigs = [
          [
            { ox: 0, oy: 0, r: 70 },
            { ox: -65, oy: 15, r: 55 },
            { ox: 65, oy: 10, r: 58 },
            { ox: -115, oy: 28, r: 42 },
            { ox: 115, oy: 25, r: 42 },
            { ox: -30, oy: -25, r: 50 },
            { ox: 35, oy: -22, r: 52 },
          ],
          [
            { ox: -10, oy: -5, r: 75 },
            { ox: -80, oy: 10, r: 50 },
            { ox: 50, oy: 12, r: 60 },
            { ox: 110, oy: 22, r: 45 },
            { ox: -130, oy: 25, r: 38 },
            { ox: 20, oy: -30, r: 48 },
            { ox: -50, oy: -20, r: 46 },
          ],
          [
            { ox: 15, oy: -10, r: 68 },
            { ox: -50, oy: 8, r: 62 },
            { ox: 80, oy: 14, r: 52 },
            { ox: -105, oy: 22, r: 45 },
            { ox: 130, oy: 26, r: 36 },
            { ox: -15, oy: -28, r: 52 },
            { ox: 45, oy: -25, r: 48 },
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
            p.r * 1.1
          );
          shGrad.addColorStop(0, 'rgba(2, 8, 20, 0.6)');
          shGrad.addColorStop(0.6, 'rgba(2, 8, 20, 0.25)');
          shGrad.addColorStop(1, 'rgba(2, 8, 20, 0)');
          shCtx.fillStyle = shGrad;
          shCtx.beginPath();
          shCtx.arc(cx + p.ox, cy + p.oy, p.r * 1.1, 0, Math.PI * 2);
          shCtx.fill();
        });
      }

      cachedSprites.push(spriteCanvas);
      cachedShadows.push(shadowCanvas);
    }

    // Try loading actual PNG files
    const imgElements: HTMLImageElement[] = cloudImageSources.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Real Game Engine Spawner Pool: 14 dynamic cloud instances
    const CLOUD_COUNT = 14;
    const clouds: CloudParticle[] = [];

    const createCloud = (initialSpawn = false): CloudParticle => {
      const imgIdx = Math.floor(Math.random() * 3);
      const isMirrored = Math.random() < 0.5;
      const baseScale = 0.45 + Math.random() * 0.95; // 0.45x to 1.4x scale variation
      const altitude = 1 + Math.random() * 2; // 1 (low/fast), 2 (mid), 3 (high/slow)

      // Speed scales with altitude and trade wind drift (East to West-Northwest across Brazil)
      const baseSpeed = (0.22 + (4 - altitude) * 0.16 + Math.random() * 0.15) * speedMultiplier;
      const windAngle = Math.PI * 0.95 + (Math.random() - 0.5) * 0.18;

      const cloudW = 340 * baseScale;
      const cloudH = 200 * baseScale;

      let startX: number;
      let startY: number;

      if (initialSpawn) {
        startX = Math.random() * (w * 1.3) - w * 0.15;
        startY = Math.random() * (h * 1.1) - h * 0.05;
      } else {
        // Spawn from East/Atlantic edge beyond visible viewport
        startX = w + 120 + Math.random() * 350;
        startY = Math.random() * (h * 0.9) - 50;
      }

      // Rich opacity variation: light wispy clouds (0.35) to thick dense cumulus (0.9)
      const targetOpacity = 0.35 + Math.random() * 0.55;

      return {
        id: Math.random(),
        x: startX,
        y: startY,
        vx: Math.cos(windAngle) * baseSpeed,
        vy: Math.sin(windAngle) * baseSpeed,
        scaleX: (isMirrored ? -1 : 1) * baseScale,
        scaleY: baseScale,
        opacity: initialSpawn ? targetOpacity * (0.4 + Math.random() * 0.6) : 0,
        targetOpacity,
        imageIndex: imgIdx,
        width: cloudW,
        height: cloudH,
        altitude,
        rotation: (Math.random() - 0.5) * 0.08,
        vRot: (Math.random() - 0.5) * 0.0002,
        life: 0,
        maxLife: 4000 + Math.random() * 5000,
        shadowOffsetX: (25 + altitude * 15) * baseScale,
        shadowOffsetY: (35 + altitude * 20) * baseScale,
      };
    };

    for (let i = 0; i < CLOUD_COUNT; i++) {
      clouds.push(createCloud(true));
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = clouds.length - 1; i >= 0; i--) {
        const c = clouds[i];
        c.life++;

        // Physics movement
        c.x += c.vx * speedMultiplier;
        c.y += c.vy * speedMultiplier;
        c.rotation += c.vRot;

        // Smooth fade-in
        if (c.opacity < c.targetOpacity) {
          c.opacity = Math.min(c.targetOpacity, c.opacity + 0.006);
        }

        // Out of bounds / Expired lifetime cleanup & instantaneous recycle
        if (c.x < -c.width - 250 || c.y > h + 250 || c.y < -250 || c.life > c.maxLife) {
          clouds.splice(i, 1);
          clouds.push(createCloud(false));
          continue;
        }

        const img = imgElements[c.imageIndex];
        const useImg = img.complete && img.naturalWidth > 0;
        const sprite = useImg ? img : cachedSprites[c.imageIndex];
        const shadow = cachedShadows[c.imageIndex];

        // =========================================================================
        // 1. SOFT RELIEF SHADOW (Projected on terrain below)
        // =========================================================================
        ctx.save();
        ctx.translate(c.x + c.shadowOffsetX, c.y + c.shadowOffsetY);
        ctx.rotate(c.rotation);
        ctx.scale(c.scaleX, c.scaleY);
        ctx.globalAlpha = c.opacity * 0.28;
        ctx.drawImage(shadow, -190, -110, 380, 220);
        ctx.restore();

        // =========================================================================
        // 2. HIGH-ALTITUDE CUMULUS CLOUD (Passing smoothly OVER the map)
        // =========================================================================
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.scale(c.scaleX, c.scaleY);
        ctx.globalAlpha = c.opacity;
        ctx.drawImage(sprite, -190, -110, 380, 220);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled, speedMultiplier]);

  if (!enabled) return null;

  return (
    <div
      className="camada-nuvens-atmosfericas-wrapper absolute inset-0 pointer-events-none"
      style={{
        transform: 'translateZ(95px)',
        transformStyle: 'preserve-3d',
        zIndex: 50,
      }}
    >
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="camada-nuvens-spawner-canvas absolute inset-0 pointer-events-none"
        style={{
          width: MAP_CANVAS_WIDTH,
          height: MAP_CANVAS_HEIGHT,
        }}
      />
    </div>
  );
};
