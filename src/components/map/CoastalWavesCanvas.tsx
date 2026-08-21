import React, { useEffect, useRef } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, createBrazilMercatorProjection } from '../../lib/mapProjections';

interface CoastalWavesCanvasProps {
  enabled?: boolean;
}

// Atlantic Coastline key points (Northeast to South Brazil)
const BRAZIL_COASTLINE_GEO: [number, number][] = [
  [-50.8, 2.5],   // Amapá
  [-50.0, 1.2],
  [-48.5, -0.8],  // Pará
  [-44.3, -2.4],  // Maranhão
  [-40.2, -3.1],  // Ceará
  [-36.2, -5.1],  // Rio Grande do Norte
  [-35.0, -6.4],
  [-34.8, -7.5],  // Paraíba / Pernambuco
  [-35.7, -9.6],  // Alagoas
  [-37.0, -10.9], // Sergipe
  [-38.5, -13.0], // Bahia
  [-39.1, -16.5], // Porto Seguro / Abrolhos
  [-39.8, -19.2], // Espírito Santo
  [-41.7, -21.8], // Rio de Janeiro (Campos)
  [-43.2, -23.0], // Rio de Janeiro Capital
  [-45.1, -23.6], // Ilhabela / SP
  [-47.0, -24.4], // Santos / Iguape
  [-48.5, -27.1], // Santa Catarina / Florianópolis
  [-49.8, -29.9], // Torres / RS
  [-52.1, -32.1], // Rio Grande / Cassino
  [-53.4, -33.7], // Chuí
];

// Major Oceanic Islands in the Atlantic
const OCEAN_ISLANDS_GEO: { name: string; geo: [number, number]; radius: number }[] = [
  { name: 'Fernando de Noronha', geo: [-32.4, -3.85], radius: 18 },
  { name: 'Atol das Rocas', geo: [-33.8, -3.86], radius: 12 },
  { name: 'Arquipélago de São Pedro e São Paulo', geo: [-29.3, 0.9], radius: 10 },
  { name: 'Ilhas de Trindade e Martim Vaz', geo: [-29.3, -20.5], radius: 14 },
  { name: 'Abrolhos', geo: [-38.7, -17.9], radius: 16 },
];

export const CoastalWavesCanvas: React.FC<CoastalWavesCanvasProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;
    const projection = createBrazilMercatorProjection();

    // 1. Convert coastal points to pixel positions
    const coastPts: { x: number; y: number; nx: number; ny: number }[] = [];
    
    for (let i = 0; i < BRAZIL_COASTLINE_GEO.length; i++) {
      const pt = projection(BRAZIL_COASTLINE_GEO[i]);
      if (pt) {
        // Calculate offshore normal vector (pointing into the Atlantic)
        let nx = 1;
        let ny = 0;
        if (i < BRAZIL_COASTLINE_GEO.length - 1) {
          const nextPt = projection(BRAZIL_COASTLINE_GEO[i + 1]);
          if (nextPt) {
            const dx = nextPt[0] - pt[0];
            const dy = nextPt[1] - pt[1];
            const len = Math.hypot(dx, dy) || 1;
            // 90 degree perpendicular pointing east/south-east
            nx = -dy / len;
            ny = dx / len;
            if (nx < 0) {
              nx = -nx;
              ny = -ny;
            }
          }
        }
        coastPts.push({ x: pt[0], y: pt[1], nx, ny });
      }
    }

    // 2. Map oceanic islands
    const islands = OCEAN_ISLANDS_GEO.map((isl) => {
      const pt = projection(isl.geo);
      return {
        name: isl.name,
        x: pt ? pt[0] : 0,
        y: pt ? pt[1] : 0,
        radius: isl.radius,
      };
    }).filter((isl) => isl.x > 0);

    // Pre-bake Island Reef Glow texture
    const reefCanvas = document.createElement('canvas');
    reefCanvas.width = 120;
    reefCanvas.height = 120;
    const rCtx = reefCanvas.getContext('2d');
    if (rCtx) {
      const rGrad = rCtx.createRadialGradient(60, 60, 4, 60, 60, 56);
      rGrad.addColorStop(0, 'rgba(34, 211, 238, 0.70)');
      rGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.35)');
      rGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      rCtx.fillStyle = rGrad;
      rCtx.beginPath();
      rCtx.arc(60, 60, 56, 0, Math.PI * 2);
      rCtx.fill();
    }

    // 3. Open ocean swells pool (optimized count)
    const SWELL_COUNT = 18;
    const swells = Array.from({ length: SWELL_COUNT }, (_, idx) => ({
      x: w * 0.58 + Math.random() * (w * 0.38),
      y: h * 0.15 + Math.random() * (h * 0.75),
      width: 45 + Math.random() * 55,
      height: 12 + Math.random() * 14,
      speed: 0.35 + Math.random() * 0.35,
      angle: -Math.PI * 0.75 + (Math.random() - 0.5) * 0.35, // traveling towards Brazil coast
      phase: (idx / SWELL_COUNT) * Math.PI * 2,
    }));

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, w, h);

      // =========================================================================
      // A. OPEN OCEAN SWELLS (Volumetric stylized waves with white foam crests)
      // =========================================================================
      swells.forEach((sw) => {
        const swellPhase = Math.sin(time * 1.5 + sw.phase);
        if (swellPhase < -0.15) return; // Wave trough hidden

        const alpha = Math.max(0, swellPhase) * 0.65;
        const swellX = sw.x + Math.cos(sw.angle) * ((time * sw.speed * 18) % 140);
        const swellY = sw.y + Math.sin(sw.angle) * ((time * sw.speed * 18) % 140);

        ctx.save();
        ctx.translate(swellX, swellY);
        ctx.rotate(sw.angle + Math.PI / 2);

        // 1. Shaded Wave Body
        ctx.fillStyle = `rgba(2, 132, 199, ${alpha * 0.75})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, sw.width * 0.5, sw.height * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. White Curved Foam Crest on top of the wave
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, sw.height * 0.1, sw.width * 0.45, Math.PI * 0.15, Math.PI * 0.85, false);
        ctx.stroke();

        ctx.restore();
      });

      // =========================================================================
      // B. COASTAL SURF BREAKING & FOAM (Espuma que quebra na praia)
      // =========================================================================
      for (let ring = 1; ring <= 3; ring++) {
        const ringTime = time * 1.8 + ring * 1.4;
        const progress = (Math.sin(ringTime) + 1) / 2; // 0 to 1 pulse
        const distOffshore = 12 + progress * 24;
        const opacity = (1 - progress) * 0.75;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw multi-segment breaking foam line along the coast
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

        // Secondary turquoise wash under the white foam
        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.55})`;
        ctx.lineWidth = 4.5;
        ctx.stroke();

        // White surf crest
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.restore();
      }

      // =========================================================================
      // C. OCEANIC ISLANDS FOAM RINGS (Fernando de Noronha, Trindade, Abrolhos)
      // =========================================================================
      islands.forEach((isl) => {
        const pulse = (Math.sin(time * 2.0) + 1) / 2;
        const sz = isl.radius * 4.4;

        // Shallow lagoon reef glow via pre-baked sprite
        ctx.drawImage(reefCanvas, isl.x - sz / 2, isl.y - sz / 2, sz, sz);

        // White breaking surf ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.45})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(isl.x, isl.y, isl.radius + pulse * 8, 0, Math.PI * 2);
        ctx.stroke();

        // Island label
        ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.font = 'bold 11px serif';
        ctx.textAlign = 'left';
        ctx.fillText(isl.name, isl.x + isl.radius + 6, isl.y + 4);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      width={MAP_CANVAS_WIDTH}
      height={MAP_CANVAS_HEIGHT}
      className="camada-ondas-oceanicas-vivas absolute inset-0 pointer-events-none z-15"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
      }}
    />
  );
};
