import { geoTransform, geoPath } from 'd3-geo';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, createBrazilMercatorProjection } from '../mapProjections';
import { SOUTH_AMERICA_LANDMASS_GEO } from '../../data/southAmericaGeo';
import { BRAZIL_OUTLINE_GEO } from '../../data/brazilOutlineGeo';
import { OCEAN_ISLANDS_SPECS } from './oceanCoastlineData';

let cachedSdfCanvas: HTMLCanvasElement | null = null;
let cachedGeoRef: any = null;

export interface DistanceTextureResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Algoritmo 1D de Transformada de Distância Euclidiana Exata O(N) (Meijster / Felzenszwalb).
 * Calcula a distância euclidiana verdadeira em tempo linear sem qualquer aproximação discreta.
 */
function edt1d(
  f: Float64Array,
  d: Float64Array,
  v: Int32Array,
  z: Float64Array,
  n: number
): void {
  let k = 0;
  v[0] = 0;
  z[0] = -1e12;
  z[1] = 1e12;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = 1e12;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dx = q - v[k];
    d[q] = dx * dx + f[v[k]];
  }
}

/**
 * Calcula o campo de distância euclidiana exata O(W * H) a partir de uma máscara binária de terra.
 * Retorna uma matriz Float32Array onde cada pixel armazena a distância física precisa em pixels até o continente.
 */
function computeExactEuclideanDistanceField(
  mask: Uint8Array,
  w: number,
  h: number
): Float32Array {
  const INF = 1e12;
  const maxDim = Math.max(w, h);
  const f = new Float64Array(maxDim);
  const d = new Float64Array(maxDim);
  const v = new Int32Array(maxDim);
  const z = new Float64Array(maxDim + 1);
  const grid = new Float64Array(w * h);

  // Passada 1: Colunas
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      f[y] = mask[y * w + x] > 0 ? 0 : INF;
    }
    edt1d(f, d, v, z, h);
    for (let y = 0; y < h; y++) {
      grid[y * w + x] = d[y];
    }
  }

  // Passada 2: Linhas
  const dist = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      f[x] = grid[row + x];
    }
    edt1d(f, d, v, z, w);
    for (let x = 0; x < w; x++) {
      dist[row + x] = Math.sqrt(d[x]);
    }
  }

  return dist;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Gera uma textura RGBA de 2048x1152 de altíssima definição com proporção isométrica 16:9:
 * - Canal R: Land Mask anti-aliasing contínuo [0 = oceano, 255 = continente]
 * - Canal G: Plataforma continental (águas rasas) com decaimento suave e desfoque Gaussiano cozido ("baked blur")
 * - Canal B: Bacia oceânica [255 = Oceano Atlântico, 0 = Oceano Pacífico]
 * - Canal A: Faixa costeira de praia/areia dourada com desfoque cozido de alta precisão
 */
export function generateCoastDistanceTexture(
  customBrazilGeo?: any,
  requestedW = MAP_CANVAS_WIDTH,
  requestedH = MAP_CANVAS_HEIGHT
): DistanceTextureResult {
  const texW = requestedW;
  const texH = requestedH;

  if (
    cachedSdfCanvas &&
    cachedSdfCanvas.width === texW &&
    cachedSdfCanvas.height === texH &&
    customBrazilGeo === cachedGeoRef
  ) {
    return { canvas: cachedSdfCanvas, width: texW, height: texH };
  }

  if (typeof document === 'undefined') {
    const mockCanvas = { width: texW, height: texH } as unknown as HTMLCanvasElement;
    return { canvas: mockCanvas, width: texW, height: texH };
  }

  const canvas = document.createElement('canvas');
  canvas.width = texW;
  canvas.height = texH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { canvas, width: texW, height: texH };
  }

  // 1. Projeção base do mapa brasileiro remapeada para a textura 1:1 com o mapa
  const baseProj = createBrazilMercatorProjection();
  const textureTransform = geoTransform({
    point: function (lon: number, lat: number) {
      const pt = baseProj([lon, lat]);
      if (pt) {
        this.stream.point(
          (pt[0] / MAP_CANVAS_WIDTH) * texW,
          (pt[1] / MAP_CANVAS_HEIGHT) * texH
        );
      }
    },
  });

  const pathGen = geoPath().projection(textureTransform).context(ctx);

  // 2. Renderiza a silhueta geométrica real da América do Sul e do Brasil (massa continental)
  ctx.clearRect(0, 0, texW, texH);
  ctx.fillStyle = '#ffffff';

  // Desenha os países vizinhos sul-americanos
  ctx.beginPath();
  pathGen(SOUTH_AMERICA_LANDMASS_GEO as any);
  ctx.fill();

  // Desenha o Brasil com os contornos reais das 27 UFs
  ctx.beginPath();
  pathGen(customBrazilGeo || BRAZIL_OUTLINE_GEO);
  ctx.fill();

  // 3. Extrai a máscara rasterizada da massa continental brasileira (sem as ilhas isoladas)
  const continentMaskImg = ctx.getImageData(0, 0, texW, texH);
  const continentMaskData = continentMaskImg.data;

  // 4. Cria a máscara binária da massa continental para a Transformada de Distância Euclidiana Exata
  const continentLandMaskBin = new Uint8Array(texW * texH);
  for (let i = 0; i < texW * texH; i++) {
    continentLandMaskBin[i] = continentMaskData[i * 4] > 120 ? 255 : 0;
  }

  // Calcula o campo de distância euclidiana exata até a costa continental
  const continentDistField = computeExactEuclideanDistanceField(continentLandMaskBin, texW, texH);

  // Distância máxima da zona costeira no Atlântico (460px para ampla abrangência da plataforma e propagação de marolas)
  const MAX_COAST_DIST = 460.0;
  // Zona imediata de arrebentação para espuma costeira viva (8px delicados, eliminando drop shadow amarelo)
  const CONTINENT_SURF_DIST = 8.0;

  // Pré-calcula as posições e plataformas orgânicas delicadas das ilhas oceânicas brasileiras
  const projectedIslands = OCEAN_ISLANDS_SPECS.map((isl, idx) => {
    const pt = baseProj(isl.geo);
    if (!pt) return null;
    const ix = (pt[0] / MAP_CANVAS_WIDTH) * texW;
    const iy = (pt[1] / MAP_CANVAS_HEIGHT) * texH;
    const islandRadius = Math.max(2.0, (isl.radius / MAP_CANVAS_WIDTH) * texW);
    // Plataforma proporcional e orgânica com transição suave que acompanha o relevo
    const shelfRadius = islandRadius + 22.0;
    const surfRadius = islandRadius + 3.0;
    return {
      ix,
      iy,
      islandRadius,
      shelfRadius,
      surfRadius,
      idx,
    };
  }).filter(Boolean) as {
    ix: number;
    iy: number;
    islandRadius: number;
    shelfRadius: number;
    surfRadius: number;
    idx: number;
  }[];

  // Eixo dorsal dos Andes separando Atlântico e Pacífico
  const getContinentSpineX = (py: number): number => {
    const t = py / texH;
    return (140 + t * 40) * (texW / 512);
  };

  // 5. Monta os 4 canais da textura RGBA final com gradiente contínuo e orgânico
  const finalImg = ctx.createImageData(texW, texH);
  const data = finalImg.data;

  for (let py = 0; py < texH; py++) {
    const spineX = getContinentSpineX(py);

    for (let px = 0; px < texW; px++) {
      const pixelIndex = py * texW + px;
      const idx = pixelIndex * 4;
      let landVal = continentMaskData[idx];
      const distCont = continentDistField[pixelIndex];

      // Canal B: Identificador de Bacia (Atlântico vs Pacífico) com transição suave
      const basinDist = Math.abs(px - spineX);
      let basinByte = 255;
      if (basinDist < 40) {
        const tBasin = (px - (spineX - 40)) / 80.0;
        basinByte = Math.floor(Math.max(0, Math.min(1, tBasin)) * 255);
      } else {
        basinByte = px >= spineX ? 255 : 0;
      }

      // Plataforma da massa continental com decaimento cúbico Hermite suave
      let continentShelf = 0.0;
      if (distCont < MAX_COAST_DIST) {
        const tDist = distCont / MAX_COAST_DIST;
        continentShelf = 1.0 - (tDist * tDist * (3.0 - 2.0 * tDist));
      }

      // Zona imediata de arrebentação (espuma viva 0-6px, sem qualquer contorno espesso)
      let continentSurf = 0.0;
      if (distCont < CONTINENT_SURF_DIST) {
        const tSurf = distCont / CONTINENT_SURF_DIST;
        continentSurf = 1.0 - (tSurf * tSurf * (3.0 - 2.0 * tSurf));
      }

      // Contribuição orgânica sutil das ilhas oceânicas (sem discos concêntricos rígidos)
      let islandShelfMax = 0.0;
      let islandSurfMax = 0.0;

      for (let i = 0; i < projectedIslands.length; i++) {
        const isl = projectedIslands[i];
        const dx = px - isl.ix;
        const dy = py - isl.iy;
        const d = Math.hypot(dx, dy);

        if (d <= isl.islandRadius) {
          landVal = 255; // Ponto central da ilha marcado como terra
        }

        if (d < isl.shelfRadius * 1.25) {
          // Variação angular com múltiplos harmônicos para quebrar qualquer simetria circular
          const angle = Math.atan2(dy, dx);
          const organicRadius = isl.shelfRadius * (1.0 + 0.16 * Math.sin(angle * 3.0 + isl.idx * 1.7) + 0.10 * Math.cos(angle * 5.0 - isl.idx));
          const distFromLand = Math.max(0, d - isl.islandRadius);
          const effectiveSpan = Math.max(1.0, organicRadius - isl.islandRadius);

          if (distFromLand < effectiveSpan) {
            const t = distFromLand / effectiveSpan;
            // Decaimento suave com amplitude delicada (0.45 max) para evitar halos pesados
            const val = (1.0 - (t * t * (3.0 - 2.0 * t))) * 0.45;
            if (val > islandShelfMax) {
              islandShelfMax = val;
            }
          }

          if (distFromLand < (isl.surfRadius - isl.islandRadius)) {
            const tb = distFromLand / Math.max(1.0, isl.surfRadius - isl.islandRadius);
            const valB = 1.0 - (tb * tb * (3.0 - 2.0 * tb));
            if (valB > islandSurfMax) {
              islandSurfMax = valB;
            }
          }
        }
      }

      // Canal R: Land Mask anti-aliasing contínuo
      data[idx + 0] = landVal;

      // Canal B: Identificador de Bacia
      data[idx + 2] = basinByte;

      // Canal G: Plataforma continental combinada (máximo suave)
      const combinedShelf = Math.max(continentShelf, islandShelfMax);
      data[idx + 1] = Math.round(Math.max(0, Math.min(1, combinedShelf)) * 255);

      // Canal A: Faixa imediata de arrebentação (usada exclusivamente para espuma do mar)
      const combinedSurf = Math.max(continentSurf, islandSurfMax);
      data[idx + 3] = Math.round(Math.max(0, Math.min(1, combinedSurf)) * 255);
    }
  }

  ctx.putImageData(finalImg, 0, 0);
  cachedSdfCanvas = canvas;
  cachedGeoRef = customBrazilGeo;

  return { canvas, width: texW, height: texH };
}
