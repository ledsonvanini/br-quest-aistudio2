import React, { useEffect, useRef, useState } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { getBrasiliaCelestialEphemeris, CelestialEphemeris } from '../../services/astronomyService';

interface ProceduralAtmosphereLayerProps {
  enabled?: boolean;
  timeOverride?: 'auto' | 'day' | 'night';
}

interface BirdEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  altitude: number;
  wingPhase: number;
  wingSpeed: number;
  isGliding: boolean;
  glideTimer: number;
  opacity: number;
  targetOpacity: number;
  age: number;
  maxLife: number;
}

export const ProceduralAtmosphereLayer: React.FC<ProceduralAtmosphereLayerProps> = ({
  enabled = true,
  timeOverride = 'auto',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() =>
    getBrasiliaCelestialEphemeris(timeOverride)
  );

  // Atualiza as efemérides celestes a cada 3 segundos
  useEffect(() => {
    const update = () => {
      setEphemeris(getBrasiliaCelestialEphemeris(timeOverride));
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [timeOverride]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // Helper para aves costeiras cartográficas (Gaivotas com física e sombras de relevo)
    const resetBird = (bird: BirdEntity, initialSpawn = false): BirdEntity => {
      const spawnZones = [
        { x: w * 0.6 + Math.random() * (w * 0.35), y: h * 0.1 + Math.random() * (h * 0.8) },
        { x: w * 0.3 + Math.random() * (w * 0.4), y: h * 0.85 + Math.random() * (h * 0.1) },
      ];
      const zone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

      const speed = 0.8 + Math.random() * 0.8;
      const angle = -Math.PI * 0.65 + (Math.random() - 0.5) * 0.6;

      bird.x = initialSpawn ? zone.x : zone.x + (Math.random() - 0.5) * 100;
      bird.y = initialSpawn ? zone.y : zone.y + (Math.random() - 0.5) * 100;
      bird.vx = Math.cos(angle) * speed;
      bird.vy = Math.sin(angle) * speed;
      bird.size = 8 + Math.random() * 5;
      bird.altitude = 12 + Math.random() * 14;
      bird.wingPhase = Math.random() * Math.PI * 2;
      bird.wingSpeed = 0.08 + Math.random() * 0.04;
      bird.isGliding = Math.random() > 0.45;
      bird.glideTimer = 60 + Math.random() * 160;
      bird.opacity = 0;
      bird.targetOpacity = 0.7 + Math.random() * 0.25;
      bird.age = 0;
      bird.maxLife = 700 + Math.floor(Math.random() * 500);
      return bird;
    };

    const BIRD_POOL_SIZE = 6;
    const birds: BirdEntity[] = Array.from({ length: BIRD_POOL_SIZE }, (_, i) => {
      const b: BirdEntity = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 9,
        altitude: 14,
        wingPhase: 0,
        wingSpeed: 0.1,
        isGliding: false,
        glideTimer: 0,
        opacity: 0,
        targetOpacity: 0.8,
        age: Math.floor((i / BIRD_POOL_SIZE) * 450),
        maxLife: 750,
      };
      return resetBird(b, true);
    });

    let animationFrameId: number;
    let lastRenderTime = performance.now();
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS para pássaros costeiros economiza ciclos de CPU/GPU

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastRenderTime;
      if (elapsed < FRAME_INTERVAL) {
        return;
      }
      const timeScale = Math.min(elapsed / 16.666, 3.0);
      lastRenderTime = now - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, w, h);

      // =========================================================================
      // SEABIRD FLOCK LIFE-CYCLE RENDERING (Gaivotas sobrevoando o mapa)
      // =========================================================================
      for (let i = 0; i < BIRD_POOL_SIZE; i++) {
        const b = birds[i];
        b.age += timeScale;

        if (b.age < 50) {
          b.opacity = Math.min(b.targetOpacity, b.opacity + 0.025 * timeScale);
        } else if (
          b.age > b.maxLife ||
          b.x < -80 ||
          b.x > w + 80 ||
          b.y < -80 ||
          b.y > h + 80
        ) {
          b.opacity = Math.max(0, b.opacity - 0.025 * timeScale);
          if (b.opacity <= 0.005) {
            resetBird(b, false);
            continue;
          }
        }

        b.x += b.vx * timeScale;
        b.y += b.vy * timeScale;

        b.glideTimer -= timeScale;
        if (b.glideTimer <= 0) {
          b.isGliding = !b.isGliding;
          b.glideTimer = b.isGliding ? 80 + Math.random() * 120 : 40 + Math.random() * 60;
        }

        if (!b.isGliding) {
          b.wingPhase += b.wingSpeed * timeScale;
        }

        const wingSpan = b.size;
        const flapOffset = b.isGliding ? -2 : Math.sin(b.wingPhase) * (b.size * 0.45);
        const headingAngle = Math.atan2(b.vy, b.vx);

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(headingAngle + Math.PI / 2);
        ctx.globalAlpha = b.opacity;

        // Ground shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-wingSpan * 0.7, flapOffset * 0.5 + 8);
        ctx.quadraticCurveTo(0, flapOffset * 0.2 + 6, wingSpan * 0.7, flapOffset * 0.5 + 8);
        ctx.stroke();

        // White Cartographic Coastal Seabird
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-wingSpan, flapOffset);
        ctx.quadraticCurveTo(-wingSpan * 0.4, flapOffset * 0.3 - 2, 0, 0);
        ctx.quadraticCurveTo(wingSpan * 0.4, flapOffset * 0.3 - 2, wingSpan, flapOffset);
        ctx.stroke();

        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, ephemeris]);

  if (!enabled) return null;

  return (
    <div
      className="camada-atmosfera-procedural-wrapper absolute inset-0 pointer-events-none overflow-visible will-change-transform"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transform: 'translateZ(120px)',
        transformStyle: 'preserve-3d',
        zIndex: 55,
      }}
    >
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="camada-atmosfera-canvas absolute inset-0 pointer-events-none"
        style={{
          width: MAP_CANVAS_WIDTH,
          height: MAP_CANVAS_HEIGHT,
        }}
      />
    </div>
  );
};
