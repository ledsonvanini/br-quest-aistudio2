/**
 * 2D Euclidean Distance Transform (EDT)
 * Algoritmo linear O(N) de Felzenszwalb e Huttenlocher.
 * Calcula a distância exata em pixels de cada ponto do mar até a costa mais próxima.
 */

function edt1d(
  f: Float32Array,
  d: Float32Array,
  v: Int32Array,
  z: Float32Array,
  n: number
): void {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;

  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }

  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/**
 * Computa o campo de distância euclidiana exato a partir de uma máscara binária (255 = terra, 0 = mar).
 * Retorna Float32Array com a distância em pixels para cada coordenada (x, y).
 */
export function compute2DEuclideanDistance(
  mask: Uint8Array,
  w: number,
  h: number
): Float32Array {
  const INF = 1e8;
  const distSq = new Float32Array(w * h);

  for (let i = 0; i < w * h; i++) {
    distSq[i] = mask[i] > 128 ? 0 : INF;
  }

  const maxDim = Math.max(w, h);
  const f = new Float32Array(maxDim);
  const d = new Float32Array(maxDim);
  const v = new Int32Array(maxDim);
  const z = new Float32Array(maxDim + 1);

  // Passagem 1: Colunas
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = distSq[y * w + x];
    edt1d(f, d, v, z, h);
    for (let y = 0; y < h; y++) distSq[y * w + x] = d[y];
  }

  // Passagem 2: Linhas
  const dist = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = distSq[y * w + x];
    edt1d(f, d, v, z, w);
    for (let x = 0; x < w; x++) dist[y * w + x] = Math.sqrt(d[x]);
  }

  return dist;
}
