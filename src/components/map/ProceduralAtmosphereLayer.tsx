import React, { useEffect, useRef } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';

interface ProceduralAtmosphereLayerProps {
  enabled?: boolean;
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

    // Helper to spawn or recycle a bird at map boundaries
    const resetBird = (bird: BirdEntity, initialSpawn = false): BirdEntity => {
      // Spawn near the Atlantic coast or southern edges
      const spawnZones = [
        { x: w * 0.6 + Math.random() * (w * 0.35), y: h * 0.1 + Math.random() * (h * 0.8) }, // Atlantic Ocean
        { x: w * 0.3 + Math.random() * (w * 0.4), y: h * 0.85 + Math.random() * (h * 0.1) }, // Southern Coast
        { x: w * 0.75 + Math.random() * (w * 0.2), y: Math.random() * (h * 0.4) }, // Northeast Coast
      ];
      const zone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

      const speed = 0.8 + Math.random() * 0.9;
      // Fly northwest-ish or along the coastline
      const angle = -Math.PI * 0.65 + (Math.random() - 0.5) * 0.8;

      bird.x = initialSpawn ? zone.x : zone.x + (Math.random() - 0.5) * 100;
      bird.y = initialSpawn ? zone.y : zone.y + (Math.random() - 0.5) * 100;
      bird.vx = Math.cos(angle) * speed;
      bird.vy = Math.sin(angle) * speed;
      bird.size = 9 + Math.random() * 6;
      bird.altitude = 12 + Math.random() * 16;
      bird.wingPhase = Math.random() * Math.PI * 2;
      bird.wingSpeed = 0.08 + Math.random() * 0.05;
      bird.isGliding = Math.random() > 0.4;
      bird.glideTimer = 60 + Math.random() * 180;
      bird.opacity = 0;
      bird.targetOpacity = 0.7 + Math.random() * 0.25;
      bird.age = 0;
      bird.maxLife = 700 + Math.floor(Math.random() * 600); // 12-20 seconds life
      return bird;
    };

    // Pre-allocated Object Pool of 7 birds (Zero allocation during frame loop)
    const BIRD_POOL_SIZE = 7;
    const birds: BirdEntity[] = Array.from({ length: BIRD_POOL_SIZE }, (_, i) => {
      const b: BirdEntity = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 10,
        altitude: 15,
        wingPhase: 0,
        wingSpeed: 0.1,
        isGliding: false,
        glideTimer: 0,
        opacity: 0,
        targetOpacity: 0.8,
        age: Math.floor((i / BIRD_POOL_SIZE) * 500), // Staggered initial ages
        maxLife: 800,
      };
      return resetBird(b, true);
    });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < BIRD_POOL_SIZE; i++) {
        const b = birds[i];
        b.age++;

        // 1. Lifecycle management (Fade in -> Cruising -> Fade out -> Recycle)
        if (b.age < 60) {
          // Fade in smoothly upon spawn
          b.opacity = Math.min(b.targetOpacity, b.opacity + 0.02);
        } else if (
          b.age > b.maxLife ||
          b.x < -100 ||
          b.x > w + 100 ||
          b.y < -100 ||
          b.y > h + 100
        ) {
          // Fade out smoothly before recycling
          b.opacity = Math.max(0, b.opacity - 0.02);
          if (b.opacity <= 0.005) {
            resetBird(b, false);
            continue;
          }
        }

        // 2. Physics & Wing mechanics
        b.x += b.vx;
        b.y += b.vy;

        // Dynamic Gliding vs Flapping cycles
        b.glideTimer--;
        if (b.glideTimer <= 0) {
          b.isGliding = !b.isGliding;
          b.glideTimer = b.isGliding ? 80 + Math.random() * 140 : 40 + Math.random() * 80;
        }

        if (!b.isGliding) {
          b.wingPhase += b.wingSpeed;
        }

        // Wing curvature calculation
        const wingSpan = b.size;
        const flapOffset = b.isGliding ? -2 : Math.sin(b.wingPhase) * (b.size * 0.45);
        const headingAngle = Math.atan2(b.vy, b.vx);

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(headingAngle + Math.PI / 2); // Orient towards velocity vector
        ctx.globalAlpha = b.opacity;

        // 3. Subtle ground shadow below bird
        ctx.save();
        ctx.translate(b.altitude * 0.6, b.altitude * 0.8);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-wingSpan * 0.8, flapOffset * 0.5);
        ctx.quadraticCurveTo(-wingSpan * 0.3, flapOffset * 0.2 - 2, 0, 0);
        ctx.quadraticCurveTo(wingSpan * 0.3, flapOffset * 0.2 - 2, wingSpan * 0.8, flapOffset * 0.5);
        ctx.stroke();
        ctx.restore();

        // 4. White Cartographic Coastal Seabird
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        // Left wing
        ctx.moveTo(-wingSpan, flapOffset);
        ctx.quadraticCurveTo(-wingSpan * 0.4, flapOffset * 0.3 - 3, 0, 0);
        // Right wing
        ctx.quadraticCurveTo(wingSpan * 0.4, flapOffset * 0.3 - 3, wingSpan, flapOffset);
        ctx.stroke();

        // Tiny beak / body tip
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, -2, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="camada-atmosfera-procedural absolute inset-0 pointer-events-none overflow-hidden"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
    >
      {/* 1. Subtle GPU-Accelerated Atmosphere Mist */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute top-[25%] left-[60%] w-[600px] h-[350px] rounded-full blur-3xl bg-cyan-400/10 pointer-events-none"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div
          className="absolute top-[50%] left-[25%] w-[700px] h-[400px] rounded-full blur-3xl bg-emerald-400/8 pointer-events-none"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
      </div>

      {/* 2. High-Performance Canvas Seabird Flight System (Zero GC Allocations, Full Lifecycle) */}
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="camada-aves-costeiras absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 3. Tactical Solar Glint in Upper Corner */}
      <div className="absolute top-[30px] right-[220px] pointer-events-none opacity-40">
        <div className="w-12 h-12 rounded-full bg-amber-200/30 blur-lg" />
        <div className="absolute inset-0 w-6 h-6 m-auto rounded-full bg-white/60 blur-xs" />
      </div>
    </div>
  );
};
