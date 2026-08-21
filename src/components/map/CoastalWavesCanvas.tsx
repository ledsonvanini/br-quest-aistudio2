import React, { useEffect, useRef } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, createBrazilMercatorProjection } from '../../lib/mapProjections';

interface CoastalWavesCanvasProps {
  enabled?: boolean;
}

// Atlantic Coastline key points (Amapá to Chuí)
const BRAZIL_COASTLINE_GEO: [number, number][] = [
  [-51.0, 4.3],   // Oiapoque / Cabo Orange
  [-50.8, 2.5],   // Amapá
  [-50.0, 1.2],   // Foz do Amazonas
  [-48.5, -0.8],  // Pará / Ilha de Marajó
  [-44.3, -2.4],  // Maranhão / Lençóis
  [-40.2, -3.1],  // Ceará / Jericoacoara
  [-38.5, -3.7],  // Fortaleza
  [-36.2, -5.1],  // Rio Grande do Norte / Cabo de São Roque
  [-35.0, -6.4],  // Pipa
  [-34.8, -7.5],  // Paraíba (Ponta do Seixas)
  [-34.8, -8.1],  // Pernambuco (Recife)
  [-35.7, -9.6],  // Alagoas (Maceió)
  [-37.0, -10.9], // Sergipe (Aracaju)
  [-38.5, -13.0], // Bahia (Salvador)
  [-39.0, -14.8], // Ilhéus
  [-39.1, -16.5], // Porto Seguro / Costa do Descobrimento
  [-39.8, -18.0], // Abrolhos / Caravelas
  [-39.8, -19.2], // Espírito Santo (Linhares)
  [-40.3, -20.3], // Vitória / Guarapari
  [-41.7, -21.8], // Rio de Janeiro (Campos dos Goytacazes)
  [-42.0, -22.9], // Cabo Frio / Búzios
  [-43.2, -23.0], // Rio de Janeiro (Copacabana / Ipanema)
  [-44.7, -23.3], // Angra dos Reis / Paraty
  [-45.1, -23.6], // Ilhabela / Litoral Norte SP
  [-46.3, -23.9], // Santos
  [-47.0, -24.4], // Iguape / Cananéia
  [-48.5, -25.5], // Paranaguá (PR)
  [-48.5, -27.1], // Santa Catarina / Florianópolis
  [-48.8, -28.5], // Cabo de Santa Marta
  [-49.8, -29.9], // Torres / RS
  [-51.2, -31.0], // Mostardas
  [-52.1, -32.1], // Rio Grande / Praia do Cassino
  [-53.4, -33.7], // Chuí / Fronteira Sul
];

// Major Oceanic Islands and Coral Reefs
const OCEAN_ISLANDS_GEO: { name: string; geo: [number, number]; radius: number; depthColor: string }[] = [
  { name: 'Fernando de Noronha', geo: [-32.4, -3.85], radius: 20, depthColor: '#06b6d4' },
  { name: 'Atol das Rocas', geo: [-33.8, -3.86], radius: 15, depthColor: '#22d3ee' },
  { name: 'Arquipélago de São Pedro e São Paulo', geo: [-29.3, 0.9], radius: 12, depthColor: '#38bdf8' },
  { name: 'Ilhas de Trindade e Martim Vaz', geo: [-29.3, -20.5], radius: 18, depthColor: '#0284c7' },
  { name: 'Arquipélago de Abrolhos', geo: [-38.7, -17.9], radius: 22, depthColor: '#14b8a6' },
];

// Ocean current arrows in the South Atlantic
const OCEAN_CURRENTS = [
  { x: 1350, y: 380, vx: -1.2, vy: 0.4, name: 'Corrente Sul Equatorial (Oeste)', color: 'rgba(56, 189, 248, 0.55)' },
  { x: 1480, y: 720, vx: -0.6, vy: 1.1, name: 'Corrente do Brasil (Sul)', color: 'rgba(52, 211, 153, 0.55)' },
  { x: 1200, y: 1120, vx: 0.8, vy: -0.9, name: 'Corrente das Malvinas (Norte)', color: 'rgba(147, 197, 253, 0.6)' },
];

interface OceanSwell {
  x: number;
  y: number;
  length: number;
  width: number;
  speed: number;
  angle: number; // Radian direction
  phase: number;
  depth: number; // 0 (surface) to 1 (deep)
}

interface SurfParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

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

    // 1. Calculate coastal points with offshore normal vectors and tangent angles
    const coastPts: { x: number; y: number; nx: number; ny: number; angle: number }[] = [];

    for (let i = 0; i < BRAZIL_COASTLINE_GEO.length; i++) {
      const pt = projection(BRAZIL_COASTLINE_GEO[i]);
      if (pt) {
        let nx = 1;
        let ny = 0;
        let angle = 0;
        if (i < BRAZIL_COASTLINE_GEO.length - 1) {
          const nextPt = projection(BRAZIL_COASTLINE_GEO[i + 1]);
          if (nextPt) {
            const dx = nextPt[0] - pt[0];
            const dy = nextPt[1] - pt[1];
            const len = Math.hypot(dx, dy) || 1;
            // 90 degree perpendicular pointing offshore (east/south-east)
            nx = -dy / len;
            ny = dx / len;
            if (nx < 0) {
              nx = -nx;
              ny = -ny;
            }
            angle = Math.atan2(dy, dx);
          }
        }
        coastPts.push({ x: pt[0], y: pt[1], nx, ny, angle });
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
        depthColor: isl.depthColor,
      };
    }).filter((isl) => isl.x > 0);

    // 3. Volumetric Ocean Swell Fronts (Frentes volumétricas de ondulação)
    const SWELL_COUNT = 32;
    const swells: OceanSwell[] = Array.from({ length: SWELL_COUNT }, (_, idx) => {
      const isNorth = idx % 2 === 0;
      return {
        x: isNorth ? w * 0.62 + Math.random() * (w * 0.35) : w * 0.55 + Math.random() * (w * 0.4),
        y: isNorth ? h * 0.12 + Math.random() * (h * 0.45) : h * 0.5 + Math.random() * (h * 0.45),
        length: 50 + Math.random() * 80,
        width: 14 + Math.random() * 18,
        speed: 0.35 + Math.random() * 0.4,
        angle: isNorth ? -Math.PI * 0.78 + (Math.random() - 0.5) * 0.2 : -Math.PI * 0.68 + (Math.random() - 0.5) * 0.25,
        phase: (idx / SWELL_COUNT) * Math.PI * 2,
        depth: Math.random(),
      };
    });

    // 4. Surf Spray Particles Pool
    const PARTICLE_COUNT = 45;
    const particles: SurfParticle[] = [];

    const initParticle = (): SurfParticle => {
      const randomCoastIdx = Math.floor(Math.random() * coastPts.length);
      const c = coastPts[randomCoastIdx];
      const dist = 5 + Math.random() * 15;
      return {
        x: c.x + c.nx * dist + (Math.random() - 0.5) * 10,
        y: c.y + c.ny * dist + (Math.random() - 0.5) * 10,
        vx: -c.nx * (0.4 + Math.random() * 0.8),
        vy: -c.ny * (0.4 + Math.random() * 0.8),
        alpha: 0.4 + Math.random() * 0.5,
        size: 1.2 + Math.random() * 2.2,
        life: 0,
        maxLife: 30 + Math.random() * 40,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = initParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.022;
      ctx.clearRect(0, 0, w, h);

      // =========================================================================
      // 1. DIRECTIONAL OCEAN CURRENTS (VETORES DE CORRENTES OCEÂNICAS ATLÂNTICAS)
      // =========================================================================
      OCEAN_CURRENTS.forEach((curr, idx) => {
        const pulse = (Math.sin(time * 1.5 + idx) + 1) / 2;
        const arrowLen = 38 + pulse * 10;
        const angle = Math.atan2(curr.vy, curr.vx);

        ctx.save();
        ctx.translate(curr.x, curr.y);
        ctx.rotate(angle);

        // Dashed streamline
        ctx.strokeStyle = curr.color;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = -time * 25;
        ctx.beginPath();
        ctx.moveTo(-arrowLen, 0);
        ctx.lineTo(arrowLen, 0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Directional arrowhead
        ctx.fillStyle = curr.color;
        ctx.beginPath();
        ctx.moveTo(arrowLen + 4, 0);
        ctx.lineTo(arrowLen - 6, -4.5);
        ctx.lineTo(arrowLen - 3, 0);
        ctx.lineTo(arrowLen - 6, 4.5);
        ctx.closePath();
        ctx.fill();

        // Oceanic current label
        ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
        ctx.font = 'bold 9px serif';
        ctx.textAlign = 'center';
        ctx.fillText(curr.name, 0, -10);

        ctx.restore();
      });

      // =========================================================================
      // 2. VOLUMETRIC OCEAN SWELLS (ONDULAÇÕES MARINHAS COM CORPO E ESPUMA)
      // =========================================================================
      swells.forEach((sw) => {
        const swellCycle = Math.sin(time * 1.4 + sw.phase);
        if (swellCycle < -0.2) return; // Wave trough below surface

        const swellAmp = Math.max(0, swellCycle);
        const distAdvance = (time * sw.speed * 22) % 180;
        const swellX = sw.x + Math.cos(sw.angle) * distAdvance;
        const swellY = sw.y + Math.sin(sw.angle) * distAdvance;

        ctx.save();
        ctx.translate(swellX, swellY);
        ctx.rotate(sw.angle + Math.PI / 2);

        // A. Shaded Volumetric Wave Body (Translucent Deep Turquoise to Ocean Blue)
        const waveBodyGrad = ctx.createLinearGradient(0, -sw.width * 0.5, 0, sw.width * 0.5);
        waveBodyGrad.addColorStop(0, `rgba(2, 132, 199, ${swellAmp * 0.05})`);
        waveBodyGrad.addColorStop(0.45, `rgba(14, 165, 233, ${swellAmp * 0.45})`);
        waveBodyGrad.addColorStop(0.55, `rgba(56, 189, 248, ${swellAmp * 0.65})`);
        waveBodyGrad.addColorStop(1, `rgba(2, 132, 199, ${swellAmp * 0.1})`);

        ctx.fillStyle = waveBodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, sw.length * 0.5, sw.width * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // B. Dynamic Curved Foam Crest Highlight (Crista branca luminosa)
        ctx.strokeStyle = `rgba(255, 255, 255, ${swellAmp * 0.85})`;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, sw.width * 0.08, sw.length * 0.44, Math.PI * 0.15, Math.PI * 0.85, false);
        ctx.stroke();

        // C. Secondary foam trail (Rastro de espuma fina)
        if (swellAmp > 0.6) {
          ctx.strokeStyle = `rgba(224, 242, 254, ${(swellAmp - 0.6) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, sw.width * 0.25, sw.length * 0.3, Math.PI * 0.2, Math.PI * 0.8, false);
          ctx.stroke();
        }

        ctx.restore();
      });

      // =========================================================================
      // 3. MULTI-LAYERED COASTAL SURF BREAKING (ARREBENTAÇÃO & ESPRAIAMENTO NA COSTA)
      // =========================================================================
      // 4 concentric breaking surf lines advancing toward the coastline
      for (let layer = 1; layer <= 4; layer++) {
        const layerPulse = time * 1.6 + layer * 1.35;
        const progress = (Math.sin(layerPulse) + 1) / 2; // 0 to 1
        const distOffshore = 6 + progress * 28;
        const opacity = (1 - progress * 0.85) * 0.85;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer Turquoise Water Wash (Lençol de água rasa)
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

        // 1. Turquoise Base Surge
        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.55})`;
        ctx.lineWidth = 5.0;
        ctx.stroke();

        // 2. White Breaking Foam Ridge
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // 3. Beach Foam Edge (Espraiamento e espuma estática junto à areia)
        if (layer === 1) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      }

      // =========================================================================
      // 4. SURF SPRAY & FOAM PARTICLES (GOTÍCULAS E ESPUMA SUSPENSA)
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles[i] = initParticle();
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - progress);

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 5. OCEANIC ISLANDS & REEF LAGOONS (NORONHA, ROCAS, ABROLHOS, TRINDADE)
      // =========================================================================
      islands.forEach((isl) => {
        const pulse = (Math.sin(time * 2.2) + 1) / 2;
        const lagoonRadius = isl.radius * 2.4;

        // Lagoon radial turquoise glow
        const lagoonGrad = ctx.createRadialGradient(isl.x, isl.y, 2, isl.x, isl.y, lagoonRadius);
        lagoonGrad.addColorStop(0, 'rgba(34, 211, 238, 0.75)');
        lagoonGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.45)');
        lagoonGrad.addColorStop(0.8, 'rgba(2, 132, 199, 0.2)');
        lagoonGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

        ctx.fillStyle = lagoonGrad;
        ctx.beginPath();
        ctx.arc(isl.x, isl.y, lagoonRadius, 0, Math.PI * 2);
        ctx.fill();

        // 1st Reef breaker ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + pulse * 0.45})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(isl.x, isl.y, isl.radius + pulse * 10, 0, Math.PI * 2);
        ctx.stroke();

        // 2nd Outer reef breaker ring
        const outerPulse = (Math.sin(time * 2.2 + 1.2) + 1) / 2;
        ctx.strokeStyle = `rgba(207, 250, 254, ${(1 - outerPulse) * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(isl.x, isl.y, isl.radius * 1.5 + outerPulse * 12, 0, Math.PI * 2);
        ctx.stroke();

        // Island name tag & pin
        ctx.fillStyle = 'rgba(240, 249, 255, 0.95)';
        ctx.font = 'bold 11px serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(isl.name, isl.x + isl.radius + 8, isl.y + 4);
        ctx.shadowBlur = 0;
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
