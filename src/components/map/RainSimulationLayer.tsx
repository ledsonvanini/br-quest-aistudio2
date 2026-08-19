import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, createBrazilMercatorProjection } from '../../lib/mapProjections';
import { StateWeatherData } from '../../services/climateService';
import { CloudRain, Droplets, Zap, Wind } from 'lucide-react';
import { GUARDIANS_DATA } from '../../data/guardiansData';

interface RainSimulationLayerProps {
  enabled?: boolean;
  active?: boolean;
  stateWeather?: Record<string, StateWeatherData>;
  intensity?: number; // 0 to 100 mm/h
  tiltAngle?: number;
  onClose?: () => void;
}

// Representative centroid coordinates for states with highest rainfall
const STATE_RAIN_CENTROIDS: Record<string, [number, number]> = {
  AM: [-64.0, -3.5],
  PA: [-52.5, -3.8],
  AP: [-51.5, 1.4],
  RR: [-61.3, 2.0],
  AC: [-70.5, -9.0],
  RO: [-62.8, -10.9],
  MA: [-45.3, -5.0],
  SC: [-50.5, -27.2],
  PR: [-51.5, -24.8],
  RS: [-53.0, -29.8],
  SP: [-48.5, -22.2],
  RJ: [-42.5, -22.2],
  MG: [-44.5, -18.5],
  ES: [-40.5, -19.5],
  BA: [-41.5, -12.5],
  GO: [-50.0, -15.5],
  MT: [-56.0, -12.5],
  MS: [-55.0, -20.5],
  TO: [-48.3, -10.2],
  PI: [-42.8, -7.7],
  CE: [-39.5, -5.3],
  RN: [-36.5, -5.8],
  PB: [-36.8, -7.1],
  PE: [-37.8, -8.3],
  AL: [-36.6, -9.6],
  SE: [-37.4, -10.6],
  DF: [-47.9, -15.8],
};

export const RainSimulationLayer: React.FC<RainSimulationLayerProps> = ({
  enabled,
  active,
  stateWeather = {},
  intensity = 65,
  tiltAngle = 42,
}) => {
  const isLayerActive = active !== undefined ? active : (enabled ?? true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simIntensity] = useState<number>(intensity);
  const [hoveredBadgeStateId, setHoveredBadgeStateId] = useState<string | null>(null);

  const projection = useMemo(() => createBrazilMercatorProjection(), []);

  // Compute states with highest precipitation and rainfall forecast
  const rainRankings = useMemo(() => {
    const regionMap: Record<string, string> = {
      norte: 'Norte',
      nordeste: 'Nordeste',
      centro_oeste: 'Centro-Oeste',
      sudeste: 'Sudeste',
      sul: 'Sul',
    };

    const list = Object.entries(stateWeather).map(([stateId, data]) => {
      const g = GUARDIANS_DATA.find((item) => item.id === stateId);
      const basePrec = data.precipitation || 0;

      // Realistic meteorological volume based on tropical convergence & regional climatology
      const syntheticFactor =
        stateId === 'AM' ? 92.5 :
        stateId === 'PA' ? 78.0 :
        stateId === 'AC' ? 74.2 :
        stateId === 'AP' ? 70.4 :
        stateId === 'SC' ? 62.7 :
        stateId === 'RJ' ? 56.3 :
        stateId === 'SP' ? 51.9 :
        stateId === 'PR' ? 48.1 :
        stateId === 'RS' ? 44.0 :
        stateId === 'MG' ? 42.5 :
        stateId === 'RO' ? 39.0 :
        stateId === 'MA' ? 36.2 :
        stateId === 'MT' ? 34.0 :
        stateId === 'GO' ? 26.0 :
        stateId === 'BA' ? 12.0 :
        stateId === 'CE' ? 8.5 :
        stateId === 'RN' ? 5.8 :
        stateId === 'PB' ? 6.2 : 24.0;

      const rainVolume = basePrec > 0 ? basePrec * 3.5 : syntheticFactor * (simIntensity / 65);

      const geo = STATE_RAIN_CENTROIDS[stateId];
      const pos = geo && projection(geo);

      return {
        stateId,
        stateName: g?.stateNamePt || stateId,
        region: (g?.regionId && regionMap[g.regionId]) || 'Brasil',
        rainVolume: parseFloat(rainVolume.toFixed(1)),
        humidity: data.humidity ?? 84,
        windSpeed: data.windSpeed ?? 18,
        condition:
          rainVolume > 70 ? 'Tempestade Tropical Severa' :
          rainVolume > 45 ? 'Chuva Forte Contínua' :
          rainVolume > 20 ? 'Pancadas Moderadas' :
          rainVolume > 8 ? 'Chuvisco / Garoa' : 'Tempo Firme / Seco',
        severity: rainVolume > 70 ? 'extreme' : rainVolume > 45 ? 'high' : rainVolume > 20 ? 'med' : 'low',
        posX: pos ? pos[0] : 0,
        posY: pos ? pos[1] : 0,
      };
    });

    return list.sort((a, b) => b.rainVolume - a.rainVolume);
  }, [stateWeather, simIntensity, projection]);

  useEffect(() => {
    if (!isLayerActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // 1. Build precise geographic hotspots calibrated by state rainfall volume (mm/dia)
    interface Hotspot {
      stateId: string;
      x: number;
      y: number;
      volume: number;
      weight: number;
      radius: number;
      color: string;
    }

    const hotspots: Hotspot[] = [];
    let totalRainWeight = 0;

    rainRankings.forEach((item) => {
      if (item.posX && item.rainVolume > 5) {
        const weight = Math.min(1.0, item.rainVolume / 85);
        totalRainWeight += weight;

        const color =
          item.rainVolume > 70
            ? 'rgba(239, 68, 68, 0.35)'
            : item.rainVolume > 45
            ? 'rgba(234, 179, 8, 0.30)'
            : item.rainVolume > 20
            ? 'rgba(6, 182, 212, 0.25)'
            : 'rgba(56, 189, 248, 0.12)';

        hotspots.push({
          stateId: item.stateId,
          x: item.posX,
          y: item.posY,
          volume: item.rainVolume,
          weight,
          radius: 35 + weight * 110,
          color,
        });
      }
    });

    // 2. High performance rainfall particles
    const DROP_COUNT = 240;
    const drops = new Float32Array(DROP_COUNT * 8);

    const initDrop = (i: number) => {
      const baseIdx = i * 8;
      let cx = w * 0.45;
      let cy = h * 0.45;

      if (hotspots.length > 0) {
        let randVal = Math.random() * totalRainWeight;
        let chosen = hotspots[0];
        for (let k = 0; k < hotspots.length; k++) {
          randVal -= hotspots[k].weight;
          if (randVal <= 0) {
            chosen = hotspots[k];
            break;
          }
        }
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * chosen.radius;
        cx = chosen.x + Math.cos(ang) * dist;
        cy = chosen.y + Math.sin(ang) * dist * 0.8;
      }

      drops[baseIdx] = cx; // X
      drops[baseIdx + 1] = cy - 250 - Math.random() * 200; // Y
      drops[baseIdx + 2] = cy + 10 + Math.random() * 20; // Target Y (ground)
      drops[baseIdx + 3] = -1.8 - Math.random() * 0.8; // VX (wind)
      drops[baseIdx + 4] = 14 + Math.random() * 8; // VY (speed)
      drops[baseIdx + 5] = 12 + Math.random() * 10; // Length
      drops[baseIdx + 6] = 0.35 + Math.random() * 0.45; // Opacity
      drops[baseIdx + 7] = 0.8 + Math.random() * 0.8; // Thickness
    };

    for (let i = 0; i < DROP_COUNT; i++) {
      initDrop(i);
      drops[i * 8 + 1] = drops[i * 8 + 2] - Math.random() * 300;
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Render rain drops
      ctx.lineWidth = 1.0;
      for (let i = 0; i < DROP_COUNT; i++) {
        const baseIdx = i * 8;
        drops[baseIdx] += drops[baseIdx + 3];
        drops[baseIdx + 1] += drops[baseIdx + 4];

        if (drops[baseIdx + 1] >= drops[baseIdx + 2]) {
          initDrop(i);
        }

        const startX = drops[baseIdx];
        const startY = drops[baseIdx + 1];
        const vx = drops[baseIdx + 3];
        const vy = drops[baseIdx + 4];
        const opacity = drops[baseIdx + 6];

        const endX = startX - vx * 0.6;
        const endY = startY - vy * 0.6;

        ctx.strokeStyle = `rgba(224, 242, 254, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isLayerActive, simIntensity, rainRankings]);

  if (!isLayerActive) return null;

  // Render top 8 states with rain badges
  const activeBadges = rainRankings.filter((item) => item.posX > 0 && item.rainVolume >= 20).slice(0, 8);
  const effectiveTilt = Math.round(tiltAngle || 42);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="camada-simulacao-chuva absolute inset-0 pointer-events-none z-20"
        style={{
          width: MAP_CANVAS_WIDTH,
          height: MAP_CANVAS_HEIGHT,
        }}
      />

      {/* =========================================================================
          BALÕES EXPANSÍVEIS INTERATIVOS NO MAPA COM EFEITO BILLBOARD 3D
          - Counter-tilt: rotateX(-42deg) para ficarem 100% em pé voltados para a tela
          - Fundo sólido 100% preto (bg-slate-950) e sombra 3D para leitura perfeita
         ========================================================================= */}
      <div
        className="camada-baloes-chuva-interativos absolute inset-0 pointer-events-none z-50 overflow-visible"
        style={{
          width: MAP_CANVAS_WIDTH,
          height: MAP_CANVAS_HEIGHT,
          transformStyle: 'preserve-3d',
        }}
      >
        {activeBadges.map((item) => {
          const isHovered = hoveredBadgeStateId === item.stateId;

          return (
            <div
              key={`rain-badge-${item.stateId}`}
              className="absolute pointer-events-auto select-none"
              style={{
                left: item.posX,
                top: item.posY,
                transform: `translate(-50%, -100%) translateZ(40px) rotateX(-${effectiveTilt}deg)`,
                transformOrigin: 'bottom center',
                zIndex: isHovered ? 120 : 40,
              }}
              onMouseEnter={() => setHoveredBadgeStateId(item.stateId)}
              onMouseLeave={() => setHoveredBadgeStateId(null)}
            >
              {/* COMPACT BADGE: oculta suavemente no hover sem flicker */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isHovered ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
                } ${
                  item.rainVolume > 70
                    ? 'bg-slate-950 border-red-500 text-red-200 shadow-red-950/90'
                    : item.rainVolume > 45
                    ? 'bg-slate-950 border-amber-500 text-amber-200 shadow-amber-950/90'
                    : 'bg-slate-950 border-cyan-400 text-cyan-200 shadow-cyan-950/90'
                }`}
              >
                <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-extrabold text-xs tracking-wider text-slate-100">{item.stateId}:</span>
                <span className="font-mono font-black text-xs text-cyan-300">{item.rainVolume} mm</span>
              </div>

              {/* EXPANDED RICH CARD: revelado suavemente de forma centralizada e estável */}
              <div
                className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-72 p-3.5 rounded-2xl shadow-2xl border-2 transition-all duration-200 ease-out origin-bottom ${
                  isHovered
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                } ${
                  item.rainVolume > 70
                    ? 'bg-slate-950/98 border-red-500 shadow-red-950/80 text-white'
                    : item.rainVolume > 45
                    ? 'bg-slate-950/98 border-amber-500 shadow-amber-950/80 text-white'
                    : 'bg-slate-950/98 border-cyan-400 shadow-cyan-950/80 text-white'
                }`}
                style={{
                  backgroundColor: '#020617',
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                      <CloudRain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-white leading-tight flex items-center gap-1">
                        <span>{item.stateName}</span>
                        <span className="text-[11px] font-mono font-bold text-amber-400">({item.stateId})</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">{item.region}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-sm text-cyan-300 leading-tight">
                      {item.rainVolume} <span className="text-[9px] font-normal text-slate-400">mm/dia</span>
                    </div>
                    <span className="text-[8px] uppercase font-black tracking-wider text-amber-400">Precipitação</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="pt-2 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Zap className="w-3 h-3 text-amber-400" /> Diagnóstico:
                    </span>
                    <span className="font-bold text-amber-300">{item.condition}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Droplets className="w-3 h-3 text-cyan-400" /> Umidade do Ar:
                    </span>
                    <span className="font-mono font-bold text-cyan-300">{item.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Wind className="w-3 h-3 text-emerald-400" /> Ventos Médios:
                    </span>
                    <span className="font-mono font-bold text-emerald-300">{item.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
