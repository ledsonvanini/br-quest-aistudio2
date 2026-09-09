/**
 * Procedural High-Fidelity Textures for Solar System Celestial Bodies
 * Generates custom canvas textures for the Sun, Moon, and Planets.
 */
import * as THREE from 'three';

const textureCache: Map<string, THREE.CanvasTexture> = new Map();

/**
 * Procedural Sun Texture with solar plasma granulation, convection cells, and sunspots
 */
export function getProceduralSunTexture(): THREE.CanvasTexture {
  if (textureCache.has('sun')) {
    return textureCache.get('sun')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base solar heat gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.3, '#fde047');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.7, '#fde047');
    grad.addColorStop(1, '#fef08a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Solar Granulation & Convection Cells
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const nx = Math.sin(x * 0.08) * Math.cos(y * 0.08);
        const ny = Math.sin(x * 0.04 + y * 0.04);
        const turbulence = Math.sin(x * 0.02) * Math.sin(y * 0.02) * 0.5 + 0.5;

        const noise = (Math.sin(x * 0.25 + nx * 5.0) * Math.cos(y * 0.25 + ny * 5.0) + 1.0) * 0.5;
        const cellNoise = (noise * 0.6 + turbulence * 0.4) * 55;

        data[idx] = Math.min(255, 255); // R
        data[idx + 1] = Math.min(255, Math.max(140, 210 - cellNoise * 0.8)); // G
        data[idx + 2] = Math.min(255, Math.max(30, 80 - cellNoise * 0.9)); // B
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Add Solar Prominences and Sunspots (manchas solares magnéticas)
    const sunspots = [
      { x: 280, y: 220, r: 18 },
      { x: 310, y: 235, r: 10 },
      { x: 620, y: 280, r: 22 },
      { x: 655, y: 295, r: 12 },
      { x: 800, y: 210, r: 15 },
    ];

    sunspots.forEach((spot) => {
      const g = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
      g.addColorStop(0, '#78350f');
      g.addColorStop(0.5, '#b45309');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set('sun', texture);
  return texture;
}

/**
 * Procedural Moon Texture with Maria (Dark Basalt Seas) and Crater Ejecta Rays
 */
export function getProceduralMoonTexture(): THREE.CanvasTexture {
  if (textureCache.has('moon')) {
    return textureCache.get('moon')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base Lunar Anorthosite Highlands
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fine Regolith Grain
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 28;
      data[i] = Math.max(0, Math.min(255, 190 + n));
      data[i + 1] = Math.max(0, Math.min(255, 195 + n));
      data[i + 2] = Math.max(0, Math.min(255, 205 + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Lunar Maria (Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, Mare Tranquillitatis)
    const maria = [
      { x: 380, y: 220, rx: 110, ry: 90, color: '#475569' },
      { x: 490, y: 190, rx: 75, ry: 65, color: '#334155' },
      { x: 580, y: 210, rx: 80, ry: 60, color: '#475569' },
      { x: 620, y: 270, rx: 90, ry: 75, color: '#334155' },
      { x: 320, y: 310, rx: 95, ry: 85, color: '#475569' },
    ];

    maria.forEach((m) => {
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, Math.max(m.rx, m.ry));
      g.addColorStop(0, m.color);
      g.addColorStop(0.75, m.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Impact Craters with Bright Ejecta Rays (Tycho & Copernicus)
    const craters = [
      { x: 420, y: 380, r: 16, name: 'Tycho' },
      { x: 390, y: 210, r: 12, name: 'Copernicus' },
      { x: 330, y: 180, r: 10, name: 'Kepler' },
    ];

    craters.forEach((c) => {
      // Ejecta ray lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(a) * 80, c.y + Math.sin(a) * 80);
        ctx.stroke();
      }
      // Crater Rim
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      // Crater Floor
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(c.x + 1, c.y + 1, c.r * 0.65, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set('moon', texture);
  return texture;
}

/**
 * Procedural Planet Textures (Jupiter bands, Mars maria & ice caps, Venus clouds, Saturn bands, Mercury craters)
 */
export function getProceduralPlanetTexture(planetId: string): THREE.CanvasTexture {
  const cacheKey = `planet-${planetId}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (planetId === 'jupiter') {
      // Jupiter: Famous gas bands (Zonal Jets) + Great Red Spot
      const bands = [
        '#d6c7af', '#b48a60', '#e3d5c1', '#a67244', '#dfd2bc',
        '#995f32', '#decbbe', '#b17b4c', '#e6dbc9', '#90532b'
      ];
      const h = canvas.height / bands.length;
      bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, i * h, canvas.width, h + 2);
      });

      // Add turbulent wavy shear between bands
      ctx.fillStyle = 'rgba(160, 95, 45, 0.35)';
      for (let x = 0; x < canvas.width; x += 16) {
        for (let b = 1; b < bands.length; b++) {
          const y = b * h + Math.sin(x * 0.05 + b) * 8;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Great Red Spot (Mancha Vermelha de Júpiter a 22°S)
      const grsX = 650;
      const grsY = 320;
      const grsGrad = ctx.createRadialGradient(grsX, grsY, 0, grsX, grsY, 55);
      grsGrad.addColorStop(0, '#dc2626');
      grsGrad.addColorStop(0.7, '#ea580c');
      grsGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = grsGrad;
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, 65, 38, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (planetId === 'saturno') {
      // Saturn: Golden-butterscotch delicate atmospheric stripes
      const bands = [
        '#ebd7b2', '#e2cb9f', '#edd8b6', '#d6be90', '#f1dfbe',
        '#ddc598', '#ebd8b6', '#d5bc8c', '#ebd7b2'
      ];
      const h = canvas.height / bands.length;
      bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, i * h, canvas.width, h + 1);
      });
    } else if (planetId === 'marte') {
      // Mars: Rusty iron oxide red/orange + Dark basalt maria + Bright white polar caps
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dark Maria (Syrtis Major, Valles Marineris)
      ctx.fillStyle = 'rgba(67, 20, 7, 0.45)';
      ctx.beginPath();
      ctx.ellipse(450, 260, 140, 80, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(720, 290, 180, 60, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Polar Ice Caps (Calotas Polares de CO2 e Gelo de Água)
      ctx.fillStyle = '#f8fafc';
      // North pole
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 0, canvas.width / 2, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      // South pole
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height, canvas.width / 2, 55, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (planetId === 'venus') {
      // Venus: Swirling dense sulfuric-acid atmosphere (golden-cream)
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.5, '#fde68a');
      grad.addColorStop(1, '#fef3c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
      for (let x = 0; x < canvas.width; x += 10) {
        const y = canvas.height / 2 + Math.sin(x * 0.02) * 50;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (planetId === 'mercurio') {
      // Mercury: Cratered dark gray silicates
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(30, 41, 59, 0.35)';
      for (let i = 0; i < 40; i++) {
        const cx = (i * 97) % canvas.width;
        const cy = (i * 61) % canvas.height;
        ctx.beginPath();
        ctx.arc(cx, cy, 10 + (i % 15), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Generic deep space planet fallback
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Saturn Ring Texture with Cassini Division and Radial Alpha Transparency
 */
export function getSaturnRingTexture(): THREE.CanvasTexture {
  if (textureCache.has('saturn-ring')) {
    return textureCache.get('saturn-ring')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0.0, 'rgba(214, 190, 144, 0.0)');
    grad.addColorStop(0.15, 'rgba(214, 190, 144, 0.85)'); // Ring C
    grad.addColorStop(0.48, 'rgba(235, 215, 178, 0.95)'); // Ring B
    grad.addColorStop(0.55, 'rgba(20, 20, 20, 0.05)');    // Cassini Division
    grad.addColorStop(0.62, 'rgba(214, 190, 144, 0.85)'); // Ring A
    grad.addColorStop(0.92, 'rgba(180, 160, 120, 0.7)');  // Outer Ring A
    grad.addColorStop(1.0, 'rgba(180, 160, 120, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('saturn-ring', texture);
  return texture;
}
