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

interface StarEntity {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
}

export const ProceduralAtmosphereLayer: React.FC<ProceduralAtmosphereLayerProps> = ({
  enabled = true,
  timeOverride = 'auto',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() =>
    getBrasiliaCelestialEphemeris(timeOverride)
  );

  // Atualiza as efemérides celestes a cada segundo
  useEffect(() => {
    const update = () => {
      setEphemeris(getBrasiliaCelestialEphemeris(timeOverride));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timeOverride]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // Gerador de estrelas para o céu noturno (centenas de estrelas de magnitudes variadas)
    const STAR_COUNT = 240;
    const stars: StarEntity[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.95,
      radius: Math.random() < 0.15 ? 1.8 + Math.random() * 1.4 : 0.6 + Math.random() * 0.9,
      baseAlpha: 0.35 + Math.random() * 0.6,
      twinkleSpeed: 0.02 + Math.random() * 0.06,
      twinklePhase: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.2 ? 210 : Math.random() < 0.35 ? 45 : 0, // azuladas, amareladas ou brancas
    }));

    // Estrelas do Cruzeiro do Sul (Posições calibradas nos céus do Sul do Brasil)
    const southernCross = [
      { name: 'Acrux (Alfa)', x: w * 0.76, y: h * 0.38, mag: 3.8, color: '#93c5fd' },
      { name: 'Gacrux (Gama)', x: w * 0.76, y: h * 0.22, mag: 3.4, color: '#fed7aa' },
      { name: 'Mimosa (Beta)', x: w * 0.71, y: h * 0.30, mag: 3.6, color: '#bfdbfe' },
      { name: 'Delta Crucis', x: w * 0.81, y: h * 0.29, mag: 2.8, color: '#e2e8f0' },
      { name: 'Intrometida (Épsilon)', x: w * 0.785, y: h * 0.33, mag: 1.8, color: '#fef08a' },
    ];

    // Helper para gerar gaivotas/aves cartográficas
    const resetBird = (bird: BirdEntity, initialSpawn = false): BirdEntity => {
      const spawnZones = [
        { x: w * 0.6 + Math.random() * (w * 0.35), y: h * 0.1 + Math.random() * (h * 0.8) },
        { x: w * 0.3 + Math.random() * (w * 0.4), y: h * 0.85 + Math.random() * (h * 0.1) },
        { x: w * 0.75 + Math.random() * (w * 0.2), y: Math.random() * (h * 0.4) },
      ];
      const zone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

      const speed = 0.8 + Math.random() * 0.9;
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
      bird.maxLife = 700 + Math.floor(Math.random() * 600);
      return bird;
    };

    const BIRD_POOL_SIZE = 6;
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
        age: Math.floor((i / BIRD_POOL_SIZE) * 500),
        maxLife: 800,
      };
      return resetBird(b, true);
    });

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      frameCount++;

      const isNight = ephemeris.isNight;
      const centerX = w * 0.5;
      const centerY = h * 0.55;

      // =========================================================================
      // MODO NOTURNO (LUA 3D, CÉU ESTRELADO & CRUZEIRO DO SUL)
      // =========================================================================
      if (isNight) {
        // 1. Renderizar Estrelas Cintilantes
        ctx.save();
        stars.forEach((s) => {
          const twinkle = Math.sin(frameCount * s.twinkleSpeed + s.twinklePhase);
          const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle * 0.35));

          ctx.fillStyle = s.hue === 210 ? `rgba(186, 230, 253, ${alpha})` : s.hue === 45 ? `rgba(254, 240, 138, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          // Pequeno halo para estrelas brilhantes
          if (s.radius > 2.0 && alpha > 0.6) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();

        // 2. Renderizar Constelação do Cruzeiro do Sul
        ctx.save();
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);

        // Eixo Maior (Gacrux -> Acrux)
        ctx.beginPath();
        ctx.moveTo(southernCross[1].x, southernCross[1].y);
        ctx.lineTo(southernCross[0].x, southernCross[0].y);
        ctx.stroke();

        // Eixo Menor (Mimosa -> Delta)
        ctx.beginPath();
        ctx.moveTo(southernCross[2].x, southernCross[2].y);
        ctx.lineTo(southernCross[3].x, southernCross[3].y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Estrelas do Cruzeiro do Sul com brilho cintilante
        southernCross.forEach((star, idx) => {
          const pulse = 1 + Math.sin(frameCount * 0.05 + idx) * 0.15;
          const starGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.mag * 4 * pulse);
          starGrad.addColorStop(0, '#ffffff');
          starGrad.addColorStop(0.3, star.color);
          starGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = starGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.mag * 4 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo brilhante
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.mag * 0.9, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // 3. Renderizar a Lua 3D com crateras e halo prateado
        const moonX = w * 0.80;
        const moonY = h * 0.14;
        const moonRadius = 46;
        const moonPulse = 1 + Math.sin(frameCount * 0.02) * 0.03;

        ctx.save();
        // Halo Lunar Atmosférico Gigante
        const moonHaloGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, 320 * moonPulse);
        moonHaloGrad.addColorStop(0, 'rgba(191, 219, 254, 0.45)');
        moonHaloGrad.addColorStop(0.2, 'rgba(147, 197, 253, 0.20)');
        moonHaloGrad.addColorStop(0.5, 'rgba(96, 165, 250, 0.06)');
        moonHaloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = moonHaloGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 320 * moonPulse, 0, Math.PI * 2);
        ctx.fill();

        // Disco da Lua
        const moonDiscGrad = ctx.createRadialGradient(moonX - 12, moonY - 12, 4, moonX, moonY, moonRadius);
        moonDiscGrad.addColorStop(0, '#ffffff');
        moonDiscGrad.addColorStop(0.5, '#e0e7ff');
        moonDiscGrad.addColorStop(0.85, '#cbd5e1');
        moonDiscGrad.addColorStop(1, '#94a3b8');

        ctx.fillStyle = moonDiscGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crateras Procedurais da Lua (Mares Lunares)
        const craters = [
          { dx: -10, dy: -8, r: 11, alpha: 0.18 },
          { dx: 12, dy: -6, r: 8, alpha: 0.15 },
          { dx: 6, dy: 14, r: 13, alpha: 0.22 },
          { dx: -16, dy: 12, r: 9, alpha: 0.16 },
          { dx: 0, dy: 4, r: 15, alpha: 0.14 },
          { dx: -4, dy: -18, r: 6, alpha: 0.12 },
        ];

        craters.forEach((c) => {
          ctx.fillStyle = `rgba(71, 85, 105, ${c.alpha})`;
          ctx.beginPath();
          ctx.arc(moonX + c.dx, moonY + c.dy, c.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Borda sutil e anel de refração
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      } else {
        // =========================================================================
        // MODO DIURNO (SOL RADIANTE, GOD RAYS & OPTICAL LENS FLARE)
        // =========================================================================
        const sunX = w * 0.78;
        const sunY = h * 0.12;

        const sunPulse = 1 + Math.sin(frameCount * 0.03) * 0.06;
        const shimmer = Math.sin(frameCount * 0.05) * 0.08;
        const intensity = ephemeris.sunIntensity || 0.8;

        ctx.save();

        // 1.A Volumetric Sun Rays (God Rays) radiating from sun across Brazil
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const rayCount = 8;
        for (let r = 0; r < rayCount; r++) {
          const baseAngle = Math.PI * 0.65 + (r - rayCount / 2) * 0.16;
          const rayAngle = baseAngle + Math.sin(frameCount * 0.015 + r) * 0.04;
          const rayLength = 1100 + Math.sin(frameCount * 0.02 + r * 1.5) * 120;
          const rayWidth = 60 + (r % 3) * 30;

          const endX = sunX + Math.cos(rayAngle) * rayLength;
          const endY = sunY + Math.sin(rayAngle) * rayLength;

          const rayGrad = ctx.createLinearGradient(sunX, sunY, endX, endY);
          rayGrad.addColorStop(0, `rgba(254, 240, 138, ${(0.18 + shimmer) * intensity})`);
          rayGrad.addColorStop(0.3, `rgba(251, 191, 36, ${(0.08 + shimmer * 0.5) * intensity})`);
          rayGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.03)');
          rayGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(endX - Math.sin(rayAngle) * rayWidth, endY + Math.cos(rayAngle) * rayWidth);
          ctx.lineTo(endX + Math.sin(rayAngle) * rayWidth, endY - Math.cos(rayAngle) * rayWidth);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // 1.B Optical Lens Flare Train along optical axis
        const opticalVecX = centerX - sunX;
        const opticalVecY = centerY - sunY;

        const flareStops = [
          { t: 0.25, size: 24 * sunPulse, color: 'rgba(56, 189, 248, 0.35)', type: 'circle' },
          { t: 0.42, size: 65 * sunPulse, color: 'rgba(251, 191, 36, 0.22)', type: 'hex' },
          { t: 0.60, size: 18 * sunPulse, color: 'rgba(244, 114, 182, 0.30)', type: 'circle' },
          { t: 0.78, size: 90 * sunPulse, color: 'rgba(167, 139, 250, 0.18)', type: 'circle' },
          { t: 0.95, size: 36 * sunPulse, color: 'rgba(52, 211, 153, 0.28)', type: 'hex' },
          { t: 1.15, size: 140 * sunPulse, color: 'rgba(251, 146, 60, 0.15)', type: 'circle' },
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        flareStops.forEach((flare) => {
          const fx = sunX + opticalVecX * flare.t;
          const fy = sunY + opticalVecY * flare.t;

          if (flare.type === 'circle') {
            const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, flare.size);
            grad.addColorStop(0, flare.color);
            grad.addColorStop(0.7, flare.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(fx, fy, flare.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (flare.type === 'hex') {
            ctx.strokeStyle = flare.color;
            ctx.lineWidth = 2.5;
            ctx.fillStyle = flare.color.replace(/[\d\.]+\)$/, '0.08)');
            ctx.beginPath();
            for (let s = 0; s < 6; s++) {
              const angle = (s * Math.PI) / 3 + frameCount * 0.005;
              const hx = fx + Math.cos(angle) * flare.size;
              const hy = fy + Math.sin(angle) * flare.size;
              if (s === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        });

        // 1.C Solar Core Corona & Anamorphic Streak
        const coreGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 260 * sunPulse);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(0.08, 'rgba(254, 240, 138, 0.85)');
        coreGrad.addColorStop(0.25, 'rgba(251, 191, 36, 0.45)');
        coreGrad.addColorStop(0.55, 'rgba(245, 158, 11, 0.18)');
        coreGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 260 * sunPulse, 0, Math.PI * 2);
        ctx.fill();

        // Anamorphic horizontal streak
        const streakGrad = ctx.createLinearGradient(sunX - 400, sunY, sunX + 400, sunY);
        streakGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        streakGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
        streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
        streakGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.25)');
        streakGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = streakGrad;
        ctx.fillRect(sunX - 400, sunY - 2.5, 800, 5);

        ctx.restore();
        ctx.restore();
      }

      // =========================================================================
      // 3. SEABIRD FLOCK LIFE-CYCLE RENDERING
      // =========================================================================
      for (let i = 0; i < BIRD_POOL_SIZE; i++) {
        const b = birds[i];
        b.age++;

        if (b.age < 60) {
          b.opacity = Math.min(b.targetOpacity, b.opacity + 0.02);
        } else if (
          b.age > b.maxLife ||
          b.x < -100 ||
          b.x > w + 100 ||
          b.y < -100 ||
          b.y > h + 100
        ) {
          b.opacity = Math.max(0, b.opacity - 0.02);
          if (b.opacity <= 0.005) {
            resetBird(b, false);
            continue;
          }
        }

        b.x += b.vx;
        b.y += b.vy;

        b.glideTimer--;
        if (b.glideTimer <= 0) {
          b.isGliding = !b.isGliding;
          b.glideTimer = b.isGliding ? 80 + Math.random() * 140 : 40 + Math.random() * 80;
        }

        if (!b.isGliding) {
          b.wingPhase += b.wingSpeed;
        }

        const wingSpan = b.size;
        const flapOffset = b.isGliding ? -2 : Math.sin(b.wingPhase) * (b.size * 0.45);
        const headingAngle = Math.atan2(b.vy, b.vx);

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(headingAngle + Math.PI / 2);
        ctx.globalAlpha = b.opacity;

        // Ground shadow
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

        // White Cartographic Coastal Seabird
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.moveTo(-wingSpan, flapOffset);
        ctx.quadraticCurveTo(-wingSpan * 0.4, flapOffset * 0.3 - 3, 0, 0);
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
  }, [enabled, ephemeris.isNight, ephemeris.sunIntensity]);

  if (!enabled) return null;

  return (
    <div
      className="camada-atmosfera-procedural absolute inset-0 pointer-events-none overflow-hidden"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
    >
      {/* 1. Iluminação Celestial (Dia: Dourado Solar • Noite: Índigo Lunar) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: ephemeris.isNight
            ? 'radial-gradient(ellipse 1300px 900px at 80% 14%, rgba(147, 197, 253, 0.16) 0%, rgba(30, 58, 138, 0.12) 45%, rgba(0, 0, 0, 0) 80%)'
            : 'radial-gradient(ellipse 1300px 900px at 78% 12%, rgba(254, 240, 138, 0.15) 0%, rgba(245, 158, 11, 0.08) 40%, rgba(0, 0, 0, 0) 75%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 2. Soft Atmospheric Mist */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className={`absolute top-[20%] left-[55%] w-[700px] h-[400px] rounded-full blur-3xl ${
            ephemeris.isNight ? 'bg-indigo-500/15' : 'bg-amber-400/10'
          } pointer-events-none`}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div
          className={`absolute top-[45%] left-[20%] w-[800px] h-[450px] rounded-full blur-3xl ${
            ephemeris.isNight ? 'bg-blue-600/10' : 'bg-cyan-400/8'
          } pointer-events-none`}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
      </div>

      {/* 3. Canvas de Alta Performance para Sol/Lua, Raios, Estrelas & Gaivotas */}
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="camada-luz-solar-lens-flare absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
