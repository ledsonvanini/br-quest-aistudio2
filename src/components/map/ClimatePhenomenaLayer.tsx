import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
  createBrazilMercatorProjection,
  cleanStateId,
} from '../../lib/mapProjections';
import {
  ClimateStationData,
  ElNinoIndexData,
  StateWeatherData,
  getEcmwfTempColor,
  ECMWF_TEMP_COLOR_STOPS,
} from '../../services/climateService';
import { geoPath } from 'd3-geo';
import { Wind, Thermometer, CloudRain, Flame, Activity, Compass, Droplets, Gauge, Info, AlertTriangle } from 'lucide-react';

export type ClimateMode = 'temperaturas_frentes' | 'ventos_aliseos' | 'precipitacao_zcas' | 'el_nino_la_nina';

interface ClimatePhenomenaLayerProps {
  active: boolean;
  mode: ClimateMode;
  stations: ClimateStationData[];
  stateWeather?: Record<string, StateWeatherData>;
  hoveredStateId?: string | null;
  elNinoData?: ElNinoIndexData | null;
  geoData?: any;
  selectedStationId?: string | null;
  onSelectStation?: (station: ClimateStationData) => void;
  speedMultiplier?: number;
  dateTimeFormatted?: string;
}

interface ParticleStreamline {
  x: number;
  y: number;
  startX: number;
  startY: number;
  speed: number;
  size: number;
  alpha: number;
  age: number;
  maxLife: number;
  trajectoryId: number;
  color: string;
}

interface StatePathItem {
  stateId: string;
  stateName: string;
  d: string | null;
  centroidX: number;
  centroidY: number;
  weather: StateWeatherData | undefined;
  temp: number;
  colorHex: string;
}

export const ClimatePhenomenaLayer: React.FC<ClimatePhenomenaLayerProps> = ({
  active,
  mode,
  stations,
  stateWeather = {},
  hoveredStateId = null,
  elNinoData,
  geoData,
  selectedStationId,
  onSelectStation,
  speedMultiplier = 1.0,
  dateTimeFormatted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const projection = useMemo(() => createBrazilMercatorProjection(), []);

  // Pre-calculate State SVG paths and thermal values
  const statePathList = useMemo<StatePathItem[]>(() => {
    if (!geoData?.features || !projection) return [];
    const pathGen = geoPath().projection(projection);

    return geoData.features.map((feat: any) => {
      const rawId =
        feat.properties?.id ||
        (feat as any).id ||
        feat.properties?.sigla ||
        feat.properties?.UF ||
        '';
      const stateId = cleanStateId(rawId);
      const weather = stateWeather[stateId];
      const d = pathGen(feat);

      const targetGeometry =
        feat.geometry?.type === 'MultiPolygon' && feat.geometry.coordinates.length > 1
          ? {
              type: 'Polygon',
              coordinates: feat.geometry.coordinates.reduce((prev: any, current: any) =>
                current[0].length > prev[0].length ? current : prev
              ),
            }
          : feat.geometry;

      let centroidX = 0;
      let centroidY = 0;
      try {
        const [cx, cy] = pathGen.centroid({ type: 'Feature', geometry: targetGeometry, properties: {} });
        if (!isNaN(cx) && !isNaN(cy)) {
          centroidX = Math.round(cx);
          centroidY = Math.round(cy);
        }
      } catch {
        // Fallback
      }

      const temp = weather?.temperature ?? 24;
      const colorObj = getEcmwfTempColor(temp);

      return {
        stateId,
        stateName: feat.properties?.name || feat.properties?.NOME || stateId,
        d,
        centroidX,
        centroidY,
        weather,
        temp,
        colorHex: colorObj.hex,
      };
    });
  }, [geoData, projection, stateWeather]);

  const hoveredStateInfo = useMemo(() => {
    if (!hoveredStateId || !stateWeather[hoveredStateId]) return null;
    return stateWeather[hoveredStateId];
  }, [hoveredStateId, stateWeather]);

  const hoverPos = useMemo(() => {
    if (!hoveredStateId) return null;
    const item = statePathList.find((p) => p.stateId === hoveredStateId);
    if (!item || !item.centroidX || !item.centroidY) return null;
    return { x: item.centroidX, y: item.centroidY };
  }, [hoveredStateId, statePathList]);

  // Atmospheric Streamlines (Execute ONLY in 'ventos_aliseos' mode)
  useEffect(() => {
    if (!active || mode !== 'ventos_aliseos') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    const PARTICLE_COUNT = 180;
    const particles: ParticleStreamline[] = [];

    const initParticle = (p?: ParticleStreamline): ParticleStreamline => {
      const trajectoryId = Math.floor(Math.random() * 4);
      let sx = 0;
      let sy = 0;
      let color = 'rgba(56, 189, 248, 0.75)';

      if (trajectoryId === 0) {
        // 1. Trade Winds from NE (Alísios de Nordeste) -> Azul Claro
        sx = 1100 + Math.random() * 400;
        sy = 100 + Math.random() * 300;
        color = 'rgba(56, 189, 248, 0.75)';
      } else if (trajectoryId === 1) {
        // 2. Flying Rivers (Rios Voadores da Amazônia até Sudeste) -> Verde Esmeralda
        sx = 450 + Math.random() * 300;
        sy = 200 + Math.random() * 250;
        color = 'rgba(52, 211, 153, 0.85)';
      } else if (trajectoryId === 2) {
        // 3. Trade Winds from SE (Alísios de Sudeste) -> Azul Royal
        sx = 1200 + Math.random() * 350;
        sy = 600 + Math.random() * 400;
        color = 'rgba(96, 165, 250, 0.75)';
      } else {
        // 4. Polar Cold Front Flow (Frente Polar no Sul) -> Ciano Gelo
        sx = 750 + Math.random() * 300;
        sy = 950 + Math.random() * 300;
        color = 'rgba(147, 197, 253, 0.8)';
      }

      return {
        x: sx,
        y: sy,
        startX: sx,
        startY: sy,
        speed: (1.4 + Math.random() * 1.8) * speedMultiplier,
        size: 2.0,
        alpha: 0.1,
        age: 0,
        maxLife: 80 + Math.random() * 90,
        trajectoryId,
        color,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = initParticle();
      p.age = Math.random() * p.maxLife;
      particles.push(p);
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Group particles by trajectoryId for batched drawing
      const groups: { [key: number]: { color: string; lines: { x1: number; y1: number; x2: number; y2: number }[] } } = {
        0: { color: 'rgba(56, 189, 248, 0.75)', lines: [] },
        1: { color: 'rgba(52, 211, 153, 0.85)', lines: [] },
        2: { color: 'rgba(96, 165, 250, 0.75)', lines: [] },
        3: { color: 'rgba(147, 197, 253, 0.8)', lines: [] },
      };

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;
        if (p.age >= p.maxLife) {
          particles[i] = initParticle(p);
          continue;
        }

        // Calculate flow angle along meteorological trajectories
        let angle = 0;
        if (p.trajectoryId === 0) {
          angle = Math.PI * 0.88 + Math.sin(p.y * 0.003) * 0.2;
        } else if (p.trajectoryId === 1) {
          if (p.x < 650) {
            angle = Math.PI * 0.65;
          } else {
            angle = Math.PI * 0.25;
          }
        } else if (p.trajectoryId === 2) {
          angle = Math.PI * 0.95;
        } else {
          angle = -Math.PI * 0.35;
        }

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        const tailLen = p.speed * 4.5;
        groups[p.trajectoryId]?.lines.push({
          x1: p.x,
          y1: p.y,
          x2: p.x - Math.cos(angle) * tailLen,
          y2: p.y - Math.sin(angle) * tailLen,
        });
      }

      // Draw all 4 groups in 4 batched strokes
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      Object.keys(groups).forEach((key) => {
        const grp = groups[Number(key)];
        if (!grp.lines.length) return;
        ctx.strokeStyle = grp.color;
        ctx.beginPath();
        for (let l = 0; l < grp.lines.length; l++) {
          const line = grp.lines[l];
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, mode, speedMultiplier]);

  if (!active) return null;

  return (
    <div
      className="camada-fenomenos-climaticos absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
    >
      {/* 1. Streamlines Dynamic Flow Canvas (Only active in Wind Mode) */}
      <canvas
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className="streamlines-canvas absolute inset-0 pointer-events-none"
      />

      {/* 2. Vector Outlines & Badges */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
      >
        <defs>
          <radialGradient id="ensoDroughtGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* 2.1 Temperature Badges on State Centroids */}
        {mode === 'temperaturas_frentes' && (
          <g className="badges-temperatura-estados pointer-events-none">
            {statePathList.map((item) => {
              if (!item.centroidX || !item.centroidY) return null;
              const isHovered = hoveredStateInfo?.stateId === item.stateId;

              return (
                <g
                  key={`temp-badge-${item.stateId}`}
                  transform={`translate(${item.centroidX}, ${item.centroidY})`}
                >
                  <rect
                    x="-24"
                    y="-12"
                    width="48"
                    height="24"
                    rx="12"
                    fill="rgba(15, 23, 42, 0.90)"
                    stroke={isHovered ? '#ffffff' : '#38bdf8'}
                    strokeWidth={isHovered ? '2' : '1'}
                  />

                  <text
                    x="-8"
                    y="4"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {item.stateId}
                  </text>

                  <text
                    x="12"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    {Math.round(item.temp)}°
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 2.3 Cartographic Labels & Atmospheric Guides */}
        {mode === 'ventos_aliseos' && (
          <g className="labels-ventos pointer-events-none animate-in fade-in duration-300">
            <g transform="translate(1320, 240)">
              <rect x="-115" y="-14" width="230" height="28" rx="8" fill="rgba(15, 23, 42, 0.92)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="serif">
                ↗ Ventos Alísios de Nordeste (Azul)
              </text>
            </g>

            <g transform="translate(1420, 680)">
              <rect x="-115" y="-14" width="230" height="28" rx="8" fill="rgba(15, 23, 42, 0.92)" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="serif">
                ↖ Ventos Alísios de Sudeste (Azul)
              </text>
            </g>

            <g transform="translate(560, 580)">
              <rect x="-135" y="-14" width="270" height="28" rx="8" fill="rgba(6, 78, 59, 0.92)" stroke="#34d399" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold" fontFamily="serif">
                ⚡ Rios Voadores da Amazônia (Verde)
              </text>
            </g>
          </g>
        )}

        {mode === 'precipitacao_zcas' && (
          <g className="labels-zcas pointer-events-none animate-in fade-in duration-300">
            <g transform="translate(860, 560)">
              <rect x="-140" y="-16" width="280" height="32" rx="8" fill="rgba(8, 47, 73, 0.92)" stroke="#0284c7" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="serif">
                🌧️ Eixo da ZCAS (Convergência de Umidade)
              </text>
            </g>

            <g transform="translate(980, 1020)">
              <path d="M -160,20 L 160,-20" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 4" />
              <rect x="-100" y="-14" width="200" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="serif">
                ❄️ Frente Fria Sinótica Polar
              </text>
            </g>
          </g>
        )}

        {mode === 'el_nino_la_nina' && (
          <g className="labels-enso pointer-events-none animate-in fade-in duration-300">
            {/* Pacific Equatorial SST Pool */}
            <g transform="translate(240, 480)">
              <circle cx="0" cy="0" r="140" fill="url(#ensoDroughtGrad)" className="animate-pulse" />
              <rect x="-130" y="-22" width="260" height="44" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-4" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">
                Oceano Pacífico Equatorial
              </text>
              <text x="0" y="12" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="mono" fontFamily="sans-serif">
                Aquecimento TSM: +2.3°C (Super El Niño)
              </text>
            </g>

            {/* Northeast Drought Highlight */}
            <g transform="translate(1220, 430)">
              <rect x="-135" y="-16" width="270" height="32" rx="8" fill="rgba(69, 10, 10, 0.94)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="serif">
                🔥 Seca Severa & Bloqueio Atmosférico
              </text>
            </g>

            {/* South Heavy Rains Highlight */}
            <g transform="translate(860, 980)">
              <rect x="-130" y="-16" width="260" height="32" rx="8" fill="rgba(8, 47, 73, 0.94)" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold" fontFamily="serif">
                🌊 Enchentes & Intensificação do Jato
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* 4. Floating Meteorological Tooltip Card on Hover */}
      {hoveredStateInfo && hoverPos && (
        <div
          className="absolute pointer-events-none z-50 transition-all duration-150"
          style={{
            left: `${hoverPos.x + 35}px`,
            top: `${hoverPos.y - 70}px`,
            transform: 'translate(0, -50%)',
          }}
        >
          <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl min-w-[240px] text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div>
                <h4 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono font-bold">{hoveredStateInfo.stateId}</span>
                  <span>{hoveredStateInfo.stateName}</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Cap: {hoveredStateInfo.capital}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span className="font-black text-base text-amber-300">
                  {hoveredStateInfo.temperature}°C
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Umid: <strong className="text-white">{hoveredStateInfo.humidity}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>Chuva: <strong className="text-white">{hoveredStateInfo.precipitation} mm</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vento: <strong className="text-white">{hoveredStateInfo.windSpeed} km/h</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pressão: <strong className="text-white">{hoveredStateInfo.surfacePressure} hPa</strong></span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Sensação: <strong className="text-amber-200">{hoveredStateInfo.apparentTemperature}°C</strong></span>
              <span className="text-emerald-400 font-semibold">● Open-Meteo ECMWF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
