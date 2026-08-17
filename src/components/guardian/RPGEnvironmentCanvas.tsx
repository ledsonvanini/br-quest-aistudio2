import React, { useEffect, useRef } from 'react';

export type EnvironmentMode = 'dia' | 'por_do_sol' | 'noite';
export type ParticleMode = 'auto' | 'folhas' | 'flores' | 'estrelas' | 'nenhuma';

interface Props {
  environmentMode: EnvironmentMode;
  particleMode: ParticleMode;
  typicalFlower: { name: string; icon: string; color: string; particleType: 'petals' | 'leaves' | 'stars' };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'petal' | 'leaf' | 'star' | 'pollen';
  pulse?: number;
}

export const RPGEnvironmentCanvas: React.FC<Props> = ({
  environmentMode,
  particleMode,
  typicalFlower,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Determine particle type to generate
    const resolvedType =
      particleMode === 'auto'
        ? typicalFlower.particleType === 'petals'
          ? 'petal'
          : typicalFlower.particleType === 'leaves'
          ? 'leaf'
          : 'star'
        : particleMode === 'folhas'
        ? 'leaf'
        : particleMode === 'flores'
        ? 'petal'
        : particleMode === 'estrelas'
        ? 'star'
        : 'none';

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = resolvedType === 'none' ? 0 : resolvedType === 'star' ? 90 : 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: resolvedType === 'star' ? Math.random() * 2.5 + 1 : Math.random() * 12 + 8,
        speedX: resolvedType === 'star' ? 0 : Math.random() * 1.5 - 0.75 + (environmentMode === 'por_do_sol' ? 0.5 : 0.2),
        speedY: resolvedType === 'star' ? 0 : Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.7 + 0.3,
        color:
          resolvedType === 'star'
            ? '#ffffff'
            : resolvedType === 'petal'
            ? typicalFlower.color || '#f43f5e'
            : '#10b981',
        shape: resolvedType === 'star' ? 'star' : resolvedType === 'petal' ? 'petal' : 'leaf',
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Twinkling stars for night
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    if (environmentMode === 'noite') {
      for (let s = 0; s < 120; s++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.75),
          size: Math.random() * 2 + 0.6,
          alpha: Math.random(),
          speed: Math.random() * 0.03 + 0.01,
        });
      }
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Environmental Backdrop Gradient & Lighting
      if (environmentMode === 'dia') {
        const diaGrad = ctx.createLinearGradient(0, 0, 0, height);
        diaGrad.addColorStop(0, 'rgba(14, 165, 233, 0.12)'); // Azul celeste suave
        diaGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.06)');
        diaGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
        ctx.fillStyle = diaGrad;
        ctx.fillRect(0, 0, width, height);

        // Sunlight subtle beam top-left
        const sunGrad = ctx.createRadialGradient(width * 0.2, 0, 10, width * 0.2, 0, width * 0.6);
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
        sunGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.05)');
        sunGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (environmentMode === 'por_do_sol') {
        // Sunset Sunset & Lens Flare
        const sunsetGrad = ctx.createLinearGradient(0, 0, 0, height);
        sunsetGrad.addColorStop(0, 'rgba(147, 51, 234, 0.25)'); // Púrpura crepúsculo
        sunsetGrad.addColorStop(0.35, 'rgba(244, 63, 94, 0.28)'); // Rosa/Vermelho quente
        sunsetGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.35)'); // Laranja vivo
        sunsetGrad.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(0, 0, width, height);

        // Lens Flare Solar Orb
        const sunX = width * 0.75;
        const sunY = height * 0.28;
        const flareGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 180);
        flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        flareGrad.addColorStop(0.2, 'rgba(253, 224, 71, 0.7)');
        flareGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
        flareGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
        ctx.fill();

        // Lens Flare secondary rings
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sunX - 120, sunY + 60, 30, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sunX - 220, sunY + 110, 55, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else if (environmentMode === 'noite') {
        // Deep RPG Night Sky with Moon Glow
        const nightGrad = ctx.createLinearGradient(0, 0, 0, height);
        nightGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)'); // Azul-índigo profundo
        nightGrad.addColorStop(0.5, 'rgba(30, 27, 75, 0.85)');
        nightGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling stars
        for (let s = 0; s < stars.length; s++) {
          const star = stars[s];
          star.alpha += star.speed;
          const currentAlpha = (Math.sin(star.alpha) + 1) / 2;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85 + 0.15})`;
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Moon Glow subtle
        const moonX = width * 0.82;
        const moonY = height * 0.18;
        const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 120);
        moonGrad.addColorStop(0, 'rgba(224, 242, 254, 0.6)');
        moonGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.2)');
        moonGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Falling / Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.pulse !== undefined) {
          p.pulse += 0.05;
          p.opacity = 0.4 + Math.sin(p.pulse) * 0.3;
        }

        // Wrap around boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        if (p.shape === 'petal') {
          drawPetal(ctx, p);
        } else if (p.shape === 'leaf') {
          drawLeaf(ctx, p);
        } else if (p.shape === 'star') {
          ctx.beginPath();
          ctx.fillStyle = '#fef08a';
          ctx.globalAlpha = p.opacity;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [environmentMode, particleMode, typicalFlower]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-ambiente-rpg absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
