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
  BRAZIL_STATES_COORDINATES,
} from '../../services/climateService';
import { geoPath } from 'd3-geo';
import {
  Wind,
  Thermometer,
  CloudRain,
  Flame,
  Activity,
  Compass,
  Droplets,
  Gauge,
  Info,
  AlertTriangle,
  Waves,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

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
  focusedStateId?: string | null;
  disableHoverTooltip?: boolean;
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
  arrowSize: number;
}

interface WindVectorGridPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
  speed: number; // km/h
  direction: number; // degrees 0-360
  name?: string;
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

// Convert temperature in °C to RGB tuple for fast canvas interpolation
function getInterpolatedRgb(temp: number): [number, number, number] {
  const stops = ECMWF_TEMP_COLOR_STOPS;
  if (temp <= stops[0].temp) {
    return hexToRgb(stops[0].hex);
  }
  if (temp >= stops[stops.length - 1].temp) {
    return hexToRgb(stops[stops.length - 1].hex);
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s1 = stops[i];
    const s2 = stops[i + 1];
    if (temp >= s1.temp && temp <= s2.temp) {
      const t = (temp - s1.temp) / (s2.temp - s1.temp);
      const rgb1 = hexToRgb(s1.hex);
      const rgb2 = hexToRgb(s2.hex);
      return [
        Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t),
        Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t),
        Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t),
      ];
    }
  }
  return [253, 224, 71];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return [r, g, b];
}

// Meteorological Wind Arrow Color Scale (km/h)
function getWindArrowColor(speedKmH: number): string {
  if (speedKmH < 10) return '#38bdf8'; // Brisa muito leve (Azul Claro)
  if (speedKmH < 18) return '#22d3ee'; // Brisa moderada (Ciano)
  if (speedKmH < 26) return '#34d399'; // Vento constante (Verde Esmeralda)
  if (speedKmH < 35) return '#facc15'; // Vento forte (Amarelo)
  if (speedKmH < 45) return '#fb923c'; // Ventania (Laranja)
  return '#f43f5e'; // Vendaval / Jato intenso (Rosa / Vermelho)
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
  focusedStateId = null,
  disableHoverTooltip = false,
}) => {
  const windCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heatMapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusedHeatMapCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

      const temp = weather?.temperature ?? 25;
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

  // Meteorological Wind Vector Grid across Brazil and the Atlantic
  const windVectorGrid = useMemo<WindVectorGridPoint[]>(() => {
    const grid: WindVectorGridPoint[] = [];

    // 1. Grid points based on state coordinates
    BRAZIL_STATES_COORDINATES.forEach((st) => {
      const pt = projection([st.lng, st.lat]);
      if (pt) {
        const weather = stateWeather[st.id];
        grid.push({
          x: pt[0],
          y: pt[1],
          lat: st.lat,
          lng: st.lng,
          speed: weather?.windSpeed ?? st.baseClimate.wind,
          direction: weather?.windDirection ?? st.baseClimate.windDir,
          name: st.name,
        });
      }
    });

    // 2. Extra maritime wind grid points in the Atlantic (Trade Winds & Marine currents)
    const marinePoints = [
      { lng: -42.0, lat: 2.0, speed: 24, dir: 65, name: 'Atlântico Equatorial Norte' },
      { lng: -35.0, lat: -1.0, speed: 26, dir: 75, name: 'Atlântico Tropical' },
      { lng: -31.0, lat: -7.0, speed: 28, dir: 110, name: 'Alísios SE Litoral Nordeste' },
      { lng: -34.0, lat: -14.0, speed: 22, dir: 120, name: 'Oceano Atlântico Leste' },
      { lng: -37.0, lat: -21.0, speed: 20, dir: 140, name: 'Bacia de Campos Oceânica' },
      { lng: -41.0, lat: -26.0, speed: 25, dir: 170, name: 'Bacia de Santos Oceânica' },
      { lng: -46.0, lat: -32.0, speed: 30, dir: 200, name: 'Atlântico Sul Polar' },
    ];

    marinePoints.forEach((mp) => {
      const pt = projection([mp.lng, mp.lat]);
      if (pt) {
        grid.push({
          x: pt[0],
          y: pt[1],
          lat: mp.lat,
          lng: mp.lng,
          speed: mp.speed,
          direction: mp.dir,
          name: mp.name,
        });
      }
    });

    return grid;
  }, [projection, stateWeather]);

  // =========================================================================
  // 1. PROFESSIONAL CONTINUOUS HEAT MAP RENDERING (IDW Inverse Distance Weighting)
  // =========================================================================
  useEffect(() => {
    if (!active || mode !== 'temperaturas_frentes') {
      const heatCanvas = heatMapCanvasRef.current;
      if (heatCanvas) {
        const ctx = heatCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, heatCanvas.width, heatCanvas.height);
      }
      return;
    }

    const canvas = heatMapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // Collect valid temperature sampling points
    const samples: { x: number; y: number; temp: number }[] = [];
    statePathList.forEach((st) => {
      if (st.centroidX && st.centroidY) {
        samples.push({ x: st.centroidX, y: st.centroidY, temp: st.temp });
      }
    });

    if (samples.length < 5) return;

    // Generate low-resolution IDW grid and upscale smoothly with bilinear filtering
    const gridScale = 8; // 8x downscaled grid for 60fps fast computation
    const gw = Math.ceil(w / gridScale);
    const gh = Math.ceil(h / gridScale);

    const offscreen = document.createElement('canvas');
    offscreen.width = gw;
    offscreen.height = gh;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    const imgData = offCtx.createImageData(gw, gh);
    const data = imgData.data;

    // IDW Power parameter (p=2.2 for smooth meteorological interpolation)
    const p = 2.2;

    for (let gy = 0; gy < gh; gy++) {
      const py = gy * gridScale;
      for (let gx = 0; gx < gw; gx++) {
        const px = gx * gridScale;

        let totalWeight = 0;
        let weightedTemp = 0;
        let exactMatch = false;

        for (let i = 0; i < samples.length; i++) {
          const s = samples[i];
          const dist = Math.hypot(px - s.x, py - s.y);

          if (dist < 1.0) {
            weightedTemp = s.temp;
            exactMatch = true;
            break;
          }

          const weight = 1.0 / Math.pow(dist, p);
          totalWeight += weight;
          weightedTemp += s.temp * weight;
        }

        const finalTemp = exactMatch ? weightedTemp : weightedTemp / (totalWeight || 1);
        const [r, g, b] = getInterpolatedRgb(finalTemp);

        const idx = (gy * gw + gx) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 190; // High saturation opacity
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Draw upscaled smoothed heat map onto the main canvas
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreen, 0, 0, w, h);

    // Also draw onto focused state canvas if present
    const focusedCanvas = focusedHeatMapCanvasRef.current;
    if (focusedCanvas) {
      const fCtx = focusedCanvas.getContext('2d');
      if (fCtx) {
        fCtx.clearRect(0, 0, w, h);
        fCtx.imageSmoothingEnabled = true;
        fCtx.imageSmoothingQuality = 'high';
        fCtx.drawImage(offscreen, 0, 0, w, h);
      }
    }

  }, [active, mode, statePathList]);

  // =========================================================================
  // 2. PROFESSIONAL WIND DIRECTION & VECTOR FLOW SYSTEM WITH ARROWHEADS
  // =========================================================================
  useEffect(() => {
    if (!active || (mode !== 'ventos_aliseos' && mode !== 'precipitacao_zcas')) {
      const canvas = windCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = windCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = MAP_CANVAS_WIDTH;
    const h = MAP_CANVAS_HEIGHT;

    // Atmospheric Streamlines with Directional Arrowheads
    const PARTICLE_COUNT = 160;
    const particles: ParticleStreamline[] = [];

    const initParticle = (p?: ParticleStreamline): ParticleStreamline => {
      const trajectoryId = Math.floor(Math.random() * 4);
      let sx = 0;
      let sy = 0;
      let color = 'rgba(56, 189, 248, 0.9)';

      if (trajectoryId === 0) {
        // 1. NE Trade Winds (Ventos Alísios de Nordeste) -> Ciano
        sx = 1100 + Math.random() * 450;
        sy = 80 + Math.random() * 320;
        color = 'rgba(56, 189, 248, 0.9)';
      } else if (trajectoryId === 1) {
        // 2. Amazon Flying Rivers (Rios Voadores) -> Esmeralda
        sx = 420 + Math.random() * 320;
        sy = 180 + Math.random() * 260;
        color = 'rgba(52, 211, 153, 0.95)';
      } else if (trajectoryId === 2) {
        // 3. SE Trade Winds (Alísios de Sudeste) -> Azul Royal
        sx = 1220 + Math.random() * 380;
        sy = 620 + Math.random() * 420;
        color = 'rgba(96, 165, 250, 0.9)';
      } else {
        // 4. Polar Cold Front Flow (Jato Polar / Frente Fria) -> Gelo
        sx = 750 + Math.random() * 320;
        sy = 960 + Math.random() * 300;
        color = 'rgba(147, 197, 253, 0.95)';
      }

      return {
        x: sx,
        y: sy,
        startX: sx,
        startY: sy,
        speed: (1.6 + Math.random() * 2.0) * speedMultiplier,
        size: 2.2,
        alpha: 0.1,
        age: 0,
        maxLife: 75 + Math.random() * 95,
        trajectoryId,
        color,
        arrowSize: 7.0,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = initParticle();
      p.age = Math.random() * p.maxLife;
      particles.push(p);
    }

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // =======================================================================
      // A. REGULAR METEOROLOGICAL WIND VECTOR ARROWS ON GRID (SETAS VETORIAIS)
      // =======================================================================
      if (mode === 'ventos_aliseos') {
        windVectorGrid.forEach((pt) => {
          // Meteorological direction: 0 = North, 90 = East, 180 = South, 270 = West
          // Angle of wind flow in canvas space
          const rad = ((pt.direction - 90) * Math.PI) / 180;
          const arrowColor = getWindArrowColor(pt.speed);
          const arrowLen = Math.min(32, Math.max(16, pt.speed * 0.9));

          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(rad);

          // Vector shaft
          ctx.strokeStyle = arrowColor;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(-arrowLen * 0.5, 0);
          ctx.lineTo(arrowLen * 0.5, 0);
          ctx.stroke();

          // Vector Arrowhead (Seta na ponta do vetor)
          ctx.fillStyle = arrowColor;
          ctx.beginPath();
          ctx.moveTo(arrowLen * 0.5 + 4, 0);
          ctx.lineTo(arrowLen * 0.5 - 5, -4);
          ctx.lineTo(arrowLen * 0.5 - 2, 0);
          ctx.lineTo(arrowLen * 0.5 - 5, 4);
          ctx.closePath();
          ctx.fill();

          // Subtle speed circle at base
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = arrowColor;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(-arrowLen * 0.5, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        });
      }

      // =======================================================================
      // B. DYNAMIC STREAMLINES WITH PROMINENT DIRECTIONAL ARROWHEADS
      // =======================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;
        if (p.age >= p.maxLife) {
          particles[i] = initParticle(p);
          continue;
        }

        // Calculate flow angle along authentic meteorological trajectories
        let angle = 0;
        if (p.trajectoryId === 0) {
          // Alísios de Nordeste: sopra de NE para SW
          angle = Math.PI * 0.88 + Math.sin(p.y * 0.003) * 0.2;
        } else if (p.trajectoryId === 1) {
          // Rios Voadores: da Amazônia para o Centro-Oeste e Sudeste
          if (p.x < 650) {
            angle = Math.PI * 0.65;
          } else {
            angle = Math.PI * 0.25;
          }
        } else if (p.trajectoryId === 2) {
          // Alísios de Sudeste: de SE para NW
          angle = Math.PI * 0.95;
        } else {
          // Jato Polar / Frente Fria: de SW para NE
          angle = -Math.PI * 0.35;
        }

        const prevX = p.x;
        const prevY = p.y;

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        const tailLen = p.speed * 5.5;
        const tailX = p.x - Math.cos(angle) * tailLen;
        const tailY = p.y - Math.sin(angle) * tailLen;

        const lifeRatio = p.age / p.maxLife;
        const fadeAlpha = lifeRatio < 0.2 ? lifeRatio / 0.2 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1.0;

        ctx.save();
        ctx.globalAlpha = fadeAlpha * 0.9;

        // 1. Streamline Tail
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // 2. DIRECTIONAL ARROWHEAD AT PARTICLE TIP (SETA DIRECIONAL LUMINOSA)
        const arrowAngle = angle;
        const arrSize = p.arrowSize;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(arrowAngle) * 3, p.y + Math.sin(arrowAngle) * 3);
        ctx.lineTo(
          p.x - Math.cos(arrowAngle - Math.PI / 6) * arrSize,
          p.y - Math.sin(arrowAngle - Math.PI / 6) * arrSize
        );
        ctx.lineTo(
          p.x - Math.cos(arrowAngle) * (arrSize * 0.45),
          p.y - Math.sin(arrowAngle) * (arrSize * 0.45)
        );
        ctx.lineTo(
          p.x - Math.cos(arrowAngle + Math.PI / 6) * arrSize,
          p.y - Math.sin(arrowAngle + Math.PI / 6) * arrSize
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, mode, speedMultiplier, windVectorGrid]);

  const hoveredStateInfo = useMemo(() => {
    // Quando um estado está inspecionado/focado, desativa o balão com dicas breves
    if (focusedStateId || disableHoverTooltip || !hoveredStateId || !stateWeather[hoveredStateId]) {
      return null;
    }
    return stateWeather[hoveredStateId];
  }, [focusedStateId, disableHoverTooltip, hoveredStateId, stateWeather]);

  // Identificação das UFs com Extremos de Temperatura (Máxima e Mínima Nacional)
  const { maxTempStateInfo, minTempStateInfo } = useMemo(() => {
    const list = Object.values(stateWeather);
    if (!list.length) return { maxTempStateInfo: null, minTempStateInfo: null };

    let maxSt = list[0];
    let minSt = list[0];

    list.forEach((st) => {
      if (st.temperature > maxSt.temperature) maxSt = st;
      if (st.temperature < minSt.temperature) minSt = st;
    });

    return { maxTempStateInfo: maxSt, minTempStateInfo: minSt };
  }, [stateWeather]);

  const hoverPos = useMemo(() => {
    if (!hoveredStateId) return null;
    const item = statePathList.find((p) => p.stateId === hoveredStateId);
    if (!item || !item.centroidX || !item.centroidY) return null;
    return { x: item.centroidX, y: item.centroidY };
  }, [hoveredStateId, statePathList]);

  if (!active) return null;

  return (
    <div
      className="camada-fenomenos-climaticos absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
    >
      {/* 1.A Background Continuous Heat Map Canvas (Muted / Grayscale when a state is focused, full opacity otherwise) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: 'url(#brazil-boundary-clip)',
          WebkitClipPath: 'url(#brazil-boundary-clip)',
        }}
      >
        <canvas
          ref={heatMapCanvasRef}
          width={MAP_CANVAS_WIDTH}
          height={MAP_CANVAS_HEIGHT}
          className={`mapa-calor-canvas absolute inset-0 pointer-events-none transition-all duration-300 ${
            focusedStateId ? 'opacity-20 grayscale brightness-75' : 'opacity-85'
          }`}
        />
      </div>

      {/* 1.B Focused State Continuous Heat Map Canvas (Vibrant, full-color IDW shader strictly inside the focused state) */}
      {focusedStateId && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'url(#focused-state-climate-clip)',
            WebkitClipPath: 'url(#focused-state-climate-clip)',
          }}
        >
          <canvas
            ref={focusedHeatMapCanvasRef}
            width={MAP_CANVAS_WIDTH}
            height={MAP_CANVAS_HEIGHT}
            className="mapa-calor-canvas-focado absolute inset-0 pointer-events-none opacity-95 transition-opacity duration-300"
          />
        </div>
      )}

      {/* 2. Meteorological Wind Streamlines & Vector Arrows Canvas */}
      <canvas
        ref={windCanvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        className={`streamlines-canvas absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 ${
          focusedStateId ? 'opacity-35' : 'opacity-100'
        }`}
      />

      {/* 3. SVG Overlays: Badges, Isotherms, Wind Guides, ENSO Gradients */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-25"
        viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
      >
        <defs>
          {/* Dynamic Clip-path for the Focused State (Precise isolation of the vibrant shader) */}
          {focusedStateId && (
            <clipPath id="focused-state-climate-clip">
              <path d={statePathList.find((s) => s.stateId === focusedStateId)?.d || ''} />
            </clipPath>
          )}

          {/* Gradiente Radial de Mancha de Calor Crítico (Hotspot Orgânico) */}
          <radialGradient id="hotspotGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#f97316" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
          </radialGradient>

          {/* Gradiente Radial de Mancha de Frio Crítico (Coldspot Orgânico) */}
          <radialGradient id="coldspotGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.0" />
          </radialGradient>

          <radialGradient id="ensoDroughtGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* 3.1 Temperature Badges, Thermal Hotspots & Coldspots on State Centroids */}
        {mode === 'temperaturas_frentes' && (
          <g className="camada-termica-extremos-e-badges pointer-events-none">
            {/* 3.1.1 MANCHAS TÉRMICAS DE CALOR EXTREMO (HOTSPOTS CRÍTICOS) */}
            {statePathList
              .filter(
                (item) =>
                  item.centroidX &&
                  item.centroidY &&
                  (item.temp >= 32 || item.stateId === maxTempStateInfo?.stateId) &&
                  (!focusedStateId || focusedStateId === item.stateId)
              )
              .map((item) => {
                const isMaxNational = item.stateId === maxTempStateInfo?.stateId;
                const rx = isMaxNational ? 110 : 75;
                const ry = isMaxNational ? 80 : 55;

                return (
                  <g
                    key={`hotspot-${item.stateId}`}
                    transform={`translate(${item.centroidX}, ${item.centroidY})`}
                    className="mancha-calor-termica"
                  >
                    {/* Difusão Térmica Orgânica sem círculos pontilhados */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={rx}
                      ry={ry}
                      fill="url(#hotspotGlowGrad)"
                      className="animate-pulse"
                      style={{ animationDuration: isMaxNational ? '2.2s' : '3.5s' }}
                    />
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={rx * 0.55}
                      ry={ry * 0.55}
                      fill="url(#hotspotGlowGrad)"
                      opacity={0.8}
                    />

                    {/* Tag de Destaque Nacional para o Ponto Mais Quente do Brasil */}
                    {isMaxNational && (
                      <g transform="translate(0, -38)" className="tag-polo-calor-maximo">
                        <rect
                          x="-82"
                          y="-13"
                          width="164"
                          height="26"
                          rx="13"
                          fill="rgba(69, 10, 10, 0.95)"
                          stroke="#ef4444"
                          strokeWidth="1.8"
                          className="shadow-xl"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#fecaca"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          🔥 Máxima Brasil: {item.stateId} {item.temp}°C
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

            {/* 3.1.2 MANCHAS TÉRMICAS DE FRIO INTENSO (COLDSPOTS CRÍTICOS) */}
            {statePathList
              .filter(
                (item) =>
                  item.centroidX &&
                  item.centroidY &&
                  (item.temp <= 21 || item.stateId === minTempStateInfo?.stateId) &&
                  (!focusedStateId || focusedStateId === item.stateId)
              )
              .map((item) => {
                const isMinNational = item.stateId === minTempStateInfo?.stateId;
                const rx = isMinNational ? 105 : 70;
                const ry = isMinNational ? 75 : 50;

                return (
                  <g
                    key={`coldspot-${item.stateId}`}
                    transform={`translate(${item.centroidX}, ${item.centroidY})`}
                    className="mancha-frio-termica"
                  >
                    {/* Difusão Criogênica Orgânica sem círculos pontilhados */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={rx}
                      ry={ry}
                      fill="url(#coldspotGlowGrad)"
                      className="animate-pulse"
                      style={{ animationDuration: isMinNational ? '2.5s' : '4s' }}
                    />
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={rx * 0.55}
                      ry={ry * 0.55}
                      fill="url(#coldspotGlowGrad)"
                      opacity={0.8}
                    />

                    {/* Tag de Destaque Nacional para o Ponto Mais Frio do Brasil */}
                    {isMinNational && (
                      <g transform="translate(0, 36)" className="tag-polo-frio-minimo">
                        <rect
                          x="-80"
                          y="-13"
                          width="160"
                          height="26"
                          rx="13"
                          fill="rgba(8, 47, 73, 0.95)"
                          stroke="#38bdf8"
                          strokeWidth="1.8"
                          className="shadow-xl"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#bae6fd"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          ❄️ Mínima Brasil: {item.stateId} {item.temp}°C
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

            {/* 3.1.3 Badges de Temperatura Centróides com Alto Contraste e Tipografia Grande para Idosos */}
            <g className="badges-temperatura-estados pointer-events-none">
              {statePathList.map((item) => {
                if (!item.centroidX || !item.centroidY) return null;
                const isFocused = focusedStateId === item.stateId;
                const isMuted = focusedStateId && !isFocused;

                const isHovered = hoveredStateInfo?.stateId === item.stateId;
                const isMax = item.stateId === maxTempStateInfo?.stateId;
                const isMin = item.stateId === minTempStateInfo?.stateId;

                return (
                  <g
                    key={`temp-badge-${item.stateId}`}
                    transform={`translate(${item.centroidX}, ${item.centroidY})`}
                    className={`transition-all duration-200 ${
                      isFocused ? 'scale-135 z-50' : isHovered ? 'scale-120 z-40' : isMuted ? 'opacity-70 scale-95' : 'opacity-95'
                    }`}
                  >
                    {/* Glow Shadow Backdrop */}
                    <rect
                      x="-40"
                      y="-19"
                      width="80"
                      height="38"
                      rx="19"
                      fill="none"
                      stroke={
                        isFocused
                          ? '#38bdf8'
                          : isMax
                          ? '#ef4444'
                          : isMin
                          ? '#38bdf8'
                          : item.colorHex
                      }
                      strokeWidth={isFocused ? '6' : isHovered ? '4' : '2'}
                      strokeOpacity={isFocused ? '0.6' : isHovered ? '0.4' : '0.25'}
                    />

                    {/* Main High-Contrast Solid Badge Container */}
                    <rect
                      x="-38"
                      y="-17"
                      width="76"
                      height="34"
                      rx="17"
                      fill={
                        isFocused
                          ? 'rgba(3, 7, 18, 0.98)'
                          : isMax
                          ? 'rgba(69, 10, 10, 0.98)'
                          : isMin
                          ? 'rgba(8, 47, 73, 0.98)'
                          : 'rgba(3, 7, 18, 0.95)'
                      }
                      stroke={
                        isFocused
                          ? '#38bdf8'
                          : isMuted
                          ? '#52525b'
                          : isHovered
                          ? '#fbbf24'
                          : isMax
                          ? '#ef4444'
                          : isMin
                          ? '#38bdf8'
                          : item.colorHex
                      }
                      strokeWidth={isFocused ? '3.5' : isMuted ? '1.5' : isHovered ? '3.0' : isMax || isMin ? '2.5' : '2.0'}
                    />

                    {/* UF Tag (Bold, Crisp, Large) */}
                    <text
                      x="-17"
                      y="5"
                      textAnchor="middle"
                      fill={isFocused ? '#38bdf8' : isMuted ? '#a1a1aa' : '#ffffff'}
                      fontSize={isFocused ? '13.5' : '13'}
                      fontWeight="900"
                      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                    >
                      {item.stateId}
                    </text>

                    {/* Divider Dot */}
                    <circle
                      cx="-1"
                      cy="0"
                      r="1.5"
                      fill={isFocused ? '#38bdf8' : isMuted ? '#71717a' : '#94a3b8'}
                    />

                    {/* Temperature Value (Large, High Contrast) */}
                    <text
                      x="17"
                      y="5"
                      textAnchor="middle"
                      fill={isFocused ? '#ffffff' : isMuted ? '#e4e4e7' : item.colorHex}
                      fontSize={isFocused ? '16.5' : '16'}
                      fontWeight="900"
                      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                    >
                      {Math.round(item.temp)}°
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        )}

        {/* 3.2 Atmospheric Wind Guides with Prominent Directional Labels */}
        {mode === 'ventos_aliseos' && (
          <g className="labels-ventos pointer-events-none animate-in fade-in duration-300">
            {/* NE Trade Winds Label */}
            <g transform="translate(1320, 240)">
              <rect x="-130" y="-16" width="260" height="32" rx="10" fill="rgba(15, 23, 42, 0.94)" stroke="#38bdf8" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="serif">
                ↙ Ventos Alísios de Nordeste (NE)
              </text>
            </g>

            {/* SE Trade Winds Label */}
            <g transform="translate(1420, 680)">
              <rect x="-130" y="-16" width="260" height="32" rx="10" fill="rgba(15, 23, 42, 0.94)" stroke="#60a5fa" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="serif">
                ↖ Ventos Alísios de Sudeste (SE)
              </text>
            </g>

            {/* Amazon Flying Rivers Conduit */}
            <g transform="translate(560, 580)">
              <rect x="-145" y="-16" width="290" height="32" rx="10" fill="rgba(6, 78, 59, 0.94)" stroke="#34d399" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="bold" fontFamily="serif">
                ↘ Rios Voadores da Amazônia (Umidade)
              </text>
            </g>
          </g>
        )}

        {/* 3.3 ZCAS Precipitation Guides */}
        {mode === 'precipitacao_zcas' && (
          <g className="labels-zcas pointer-events-none animate-in fade-in duration-300">
            <g transform="translate(860, 560)">
              <rect x="-150" y="-18" width="300" height="36" rx="10" fill="rgba(8, 47, 73, 0.94)" stroke="#0284c7" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="serif">
                🌧️ Eixo da ZCAS (Convergência de Umidade)
              </text>
            </g>

            <g transform="translate(980, 1020)">
              <path d="M -160,20 L 160,-20" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 4" />
              <rect x="-110" y="-16" width="220" height="32" rx="10" fill="rgba(15, 23, 42, 0.92)" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="serif">
                ❄️ Frente Fria Sinótica Polar
              </text>
            </g>
          </g>
        )}

        {/* 3.4 ENSO Pacific Anomaly */}
        {mode === 'el_nino_la_nina' && (
          <g className="labels-enso pointer-events-none animate-in fade-in duration-300">
            <g transform="translate(240, 480)">
              <circle cx="0" cy="0" r="140" fill="url(#ensoDroughtGrad)" className="animate-pulse" />
              <rect x="-140" y="-24" width="280" height="48" rx="12" fill="rgba(15, 23, 42, 0.95)" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-5" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="serif">
                Oceano Pacífico Equatorial
              </text>
              <text x="0" y="14" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="mono" fontFamily="sans-serif">
                Aquecimento TSM: +2.3°C (Super El Niño)
              </text>
            </g>

            <g transform="translate(1220, 430)">
              <rect x="-140" y="-18" width="280" height="36" rx="10" fill="rgba(69, 10, 10, 0.94)" stroke="#ef4444" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold" fontFamily="serif">
                🔥 Seca Severa & Bloqueio Atmosférico
              </text>
            </g>

            <g transform="translate(860, 980)">
              <rect x="-135" y="-18" width="270" height="36" rx="10" fill="rgba(8, 47, 73, 0.94)" stroke="#06b6d4" strokeWidth="1.8" />
              <text x="0" y="5" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="bold" fontFamily="serif">
                🌊 Enchentes & Intensificação do Jato
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* 4. Professional ECMWF Thermal Colorbar Legend (Escala Térmica Contínua) */}
      {mode === 'temperaturas_frentes' && (
        <div className="absolute bottom-6 left-8 z-30 pointer-events-auto bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col gap-1.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-[11px] font-serif font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Escala Térmica ECMWF / INMET
            </span>
            <span className="font-mono text-[10px] text-amber-300">°C</span>
          </div>

          {/* Continuous gradient strip */}
          <div
            className="w-56 h-3.5 rounded-md border border-slate-700 shadow-inner"
            style={{
              background: `linear-gradient(to right, ${ECMWF_TEMP_COLOR_STOPS.map((s) => s.hex).join(', ')})`,
            }}
          />

          {/* Scale labels */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5">
            <span>-4°C</span>
            <span>8°C</span>
            <span>20°C</span>
            <span>28°C</span>
            <span>36°C+</span>
          </div>
        </div>
      )}

      {/* 5. Wind Beaufort Scale Legend */}
      {mode === 'ventos_aliseos' && (
        <div className="absolute bottom-6 left-8 z-30 pointer-events-auto bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col gap-1.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-[11px] font-serif font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Velocidade dos Ventos (km/h)
            </span>
            <span className="font-mono text-[10px] text-cyan-300">Vetores</span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
            <div className="p-1 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300">
              &lt; 15 km/h
            </div>
            <div className="p-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              15-25
            </div>
            <div className="p-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
              25-35
            </div>
            <div className="p-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300">
              &gt; 35 km/h
            </div>
          </div>
        </div>
      )}

      {/* 6. Floating Meteorological Tooltip Card on Hover (+50% Scale, 100% Solid Ultra-Sharp High-DPI Rendering) */}
      {hoveredStateInfo && hoverPos && !disableHoverTooltip && (
        <div
          id="balao-telemetria-estado-hover"
          className="balao-telemetria-estado-hover absolute pointer-events-none transition-all duration-150 select-none"
          style={{
            left: `${
              hoverPos.x > 1680
                ? hoverPos.x - 30
                : hoverPos.x < 720
                ? hoverPos.x + 30
                : hoverPos.x + 30
            }px`,
            top: `${
              hoverPos.y < 400
                ? hoverPos.y + 40
                : hoverPos.y > 1020
                ? hoverPos.y - 40
                : hoverPos.y
            }px`,
            transform: `translate(${hoverPos.x > 1680 ? '-100%' : '0%'}, ${
              hoverPos.y < 400 ? '0%' : hoverPos.y > 1020 ? '-100%' : '-50%'
            }) translateZ(0)`,
            zIndex: 99999,
            isolation: 'isolate',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="card-balao-conteudo bg-slate-950 border-2 border-cyan-400/90 rounded-2xl p-4 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_25px_rgba(6,182,212,0.35)] w-[min(94vw,430px)] max-w-[calc(100vw-24px)] text-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="min-w-0 pr-2">
                <h4 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2 truncate">
                  <span className="text-amber-300 font-mono font-black text-sm px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/60 shrink-0">
                    {hoveredStateInfo.stateId}
                  </span>
                  <span className="truncate font-serif font-bold text-white tracking-wide">
                    {hoveredStateInfo.stateName}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                  Capital: <strong className="text-slate-200">{hoveredStateInfo.capital}</strong>
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-inner shrink-0">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <span className="font-black text-lg sm:text-xl text-amber-300 font-mono">
                  {hoveredStateInfo.temperature}°C
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Umid: <strong className="text-white font-bold">{hoveredStateInfo.humidity}%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Chuva: <strong className="text-white font-bold">{hoveredStateInfo.precipitation} mm</strong></span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vento: <strong className="text-white font-bold">{hoveredStateInfo.windSpeed} km/h</strong></span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                <Gauge className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Pressão: <strong className="text-white font-bold">{hoveredStateInfo.surfacePressure} hPa</strong></span>
              </div>
            </div>

            {/* Destaque das Temperaturas Mínima e Máxima do Estado com truncamento a 2 casas decimais */}
            <div className="pt-2.5 border-t border-slate-800/90 grid grid-cols-2 gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#38bdf8] shrink-0" />
                <span className="text-blue-300 font-semibold">Mín:</span>
                <strong className="text-white font-black tracking-tight text-sm sm:text-base">
                  {Number(hoveredStateInfo.minTemperature ?? (hoveredStateInfo.temperature - 4.45)).toFixed(2)}°C
                </strong>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] shrink-0" />
                <span className="text-rose-300 font-semibold">Máx:</span>
                <strong className="text-white font-black tracking-tight text-sm sm:text-base">
                  {Number(hoveredStateInfo.maxTemperature ?? (hoveredStateInfo.temperature + 3.25)).toFixed(2)}°C
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <span>Sensação: <strong className="text-amber-200 font-bold">{Number(hoveredStateInfo.apparentTemperature).toFixed(1)}°C</strong></span>
                <span className="text-slate-600">•</span>
                <span>UV: <strong className="text-amber-300 font-bold">{Number(hoveredStateInfo.uvIndex ?? 7.0).toFixed(1)}</strong></span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ECMWF / INMET
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
