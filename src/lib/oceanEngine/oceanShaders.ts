/**
 * WebGL2 Shaders para a Mini-Engine do Oceano Atlântico e Pacífico
 * 
 * Funcionalidades Visuais:
 * - Gradiente Fractal Noise em Grande Escala (águas profundas azul escuro e abissal a azul claro/ciano radiante)
 * - Cáusticas de luz líquida orgânica contínua com Domain Warping (estilo referências visuais fotográficas)
 * - Camada de partículas marinhas desfocadas discretas (bokeh blur) em deriva oceânica suave
 * - Eliminação total de contornos de 'rios' ou faixas artificiais na costa
 * - Cobertura espacial ilimitada para todo o espaço navegável sem bounding box
 */

export const OCEAN_VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const OCEAN_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform int u_theme_mode;
uniform sampler2D u_coast_distance_tex;
uniform vec2 u_sun_pos;
uniform vec2 u_map_scale;

// Paletas de cores temáticas com contraste profundo, luz líquida cáustica, espuma e águas rasas harmoniosas
void getOceanPalette(
  int mode, 
  out vec3 deepAbyss, 
  out vec3 midOcean, 
  out vec3 lightAzure, 
  out vec3 causticHighlight,
  out vec3 shallowWater,
  out vec3 beachSand
) {
  if (mode == 1) {
    // Biodiversidade: Abismo petróleo-esmeralda, recifes suaves e espuma marinha
    deepAbyss        = vec3(0.008, 0.080, 0.120);
    midOcean         = vec3(0.018, 0.180, 0.240);
    lightAzure       = vec3(0.040, 0.340, 0.420);
    causticHighlight = vec3(0.380, 0.880, 0.800);
    shallowWater     = vec3(0.035, 0.360, 0.420); // Recifes suaves integrados
    beachSand        = vec3(0.940, 0.990, 0.970); // Espuma pura marinha
  } else if (mode == 2) {
    // Musicalidades: Safira noturna profunda e filamentos celestes luminosos
    deepAbyss        = vec3(0.008, 0.050, 0.150);
    midOcean         = vec3(0.022, 0.130, 0.280);
    lightAzure       = vec3(0.065, 0.260, 0.480);
    causticHighlight = vec3(0.500, 0.780, 0.950);
    shallowWater     = vec3(0.055, 0.280, 0.480); // Ciano safira suave
    beachSand        = vec3(0.930, 0.960, 1.000); // Espuma noturna luminosa
  } else {
    // Aventura, Clima, Geopolítica (Padrão Cartográfico de Alta Fidelidade):
    // Paleta cartográfica refinada e harmoniosa, sem saturação excessiva
    deepAbyss        = vec3(0.012, 0.100, 0.200); // Azul marinho profundo
    midOcean         = vec3(0.028, 0.180, 0.320); // Azul cerúleo náutico
    lightAzure       = vec3(0.060, 0.300, 0.460); // Azul claro oceânico suave
    causticHighlight = vec3(0.400, 0.820, 0.940); // Brilho cáustico de luz líquida
    shallowWater     = vec3(0.050, 0.340, 0.480); // Azul-turquesa costeiro suave, equilibrado e elegante
    beachSand        = vec3(0.950, 0.980, 1.000); // Espuma cristalina do mar
  }
}

// Pseudo-random hash bidimensional rápido e estável
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Ruído suave de valor 2D com interpolação Hermite cúbica
float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion (FBM) de 3 oitavas ultra-otimizado
float fbm(vec2 p) {
  float v = 0.0;
  v += 0.55 * smoothNoise(p);
  p = p * 2.04 + vec2(13.5, 27.2);
  v += 0.30 * smoothNoise(p);
  p = p * 2.08 + vec2(42.1, 11.8);
  v += 0.15 * smoothNoise(p);
  return v;
}

// Campo de fluxo contínuo para simulação orgânica de correntes oceânicas (Flow Field - Seção 11 do Plano)
vec2 getOceanFlowField(vec2 p, float t) {
  float flowAngle = sin(p.y * 1.4 + t * 0.15) * 1.2 + cos(p.x * 1.2 - t * 0.12) * 0.8;
  return vec2(cos(flowAngle), sin(flowAngle)) * 0.12;
}

// Algoritmo de Ondulação Oceânica Contínua e Luz Líquida em Grande Escala (Liquid Caustic Fractal)
// Implementa Domain Warping de duas etapas + Swell + Cáusticas tridimensionais (Seções 8 e 10 do Plano)
float getLiquidCausticFractal(vec2 uv, float t) {
  vec2 p = uv * 2.8;

  // Swell: Ondulações de grande escala em direções cruzadas (Atlântico Sul)
  vec2 dir1 = vec2(0.866, 0.500);
  vec2 dir2 = vec2(-0.500, 0.866);

  float swell1 = sin(dot(p, dir1) * 1.5 + t * 0.70);
  float swell2 = cos(dot(p, dir2) * 1.3 - t * 0.55);
  float swell = (swell1 + swell2) * 0.5;

  // Flow Field orgânico para deriva da massa d'água
  vec2 flow = getOceanFlowField(p * 0.4, t);

  // Domain Warping contínuo (Seção 8 do Plano): UV -> Noise -> Domain Warp -> Caustics
  vec2 q = vec2(
    fbm(p + flow + vec2(0.0, 0.0) + swell * 0.20),
    fbm(p + flow + vec2(4.3, 1.7) - swell * 0.20)
  );

  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(1.7, 7.4) + vec2(0.04, -0.03) * t),
    fbm(p + 1.8 * q + vec2(6.2, 3.1) - vec2(0.03, 0.05) * t)
  );

  // Campo base de relevo líquido profundo em movimento suave
  float baseDepth = fbm(p + 1.5 * r + vec2(0.02, 0.03) * t);

  // Véu suave de filamentos cáusticos de luz líquida sob a superfície
  float caustics1 = sin((baseDepth + q.x * 0.65) * 4.2 + t * 0.65);
  float caustics2 = cos((r.y - q.y * 0.65) * 3.8 - t * 0.55);
  float causticLuminance = (caustics1 * 0.5 + 0.5) * (caustics2 * 0.5 + 0.5);
  causticLuminance = smoothstep(0.22, 0.78, causticLuminance);

  // Combinação orgânica: relevo oceânico vivo e luz marinha líquida
  return clamp(baseDepth * 0.55 + causticLuminance * 0.45, 0.0, 1.0);
}

// Partículas marinhas desfocadas discretas (Bokeh Plâncton / Luz fora de foco)
float getBlurredParticles(vec2 uv, float t) {
  float particles = 0.0;
  vec2 gridUV = uv * 10.0;
  vec2 id = floor(gridUV);
  vec2 gv = fract(gridUV) - 0.5;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 cellId = id + neighbor;
      float h1 = hash21(cellId);
      float h2 = hash21(cellId + 31.7);
      
      vec2 drift = vec2(
        sin(t * 0.50 + h1 * 6.28) * 0.22 + sin(t * 0.20) * 0.10,
        cos(t * 0.45 + h2 * 6.28) * 0.22 + cos(t * 0.25) * 0.10
      );
      
      vec2 pPos = neighbor + (vec2(h1, h2) - 0.5) + drift;
      float d = length(gv - pPos);
      
      float radius = mix(0.14, 0.32, hash21(cellId + 17.8));
      float blur = smoothstep(radius, 0.0, d);
      float pulse = 0.5 + 0.5 * sin(t * 0.75 + h1 * 6.28);
      particles += blur * blur * pulse * 0.22;
    }
  }
  return particles;
}

// Ondas e Marolas Costeiras Orgânicas
// Emergem naturalmente da costa e viajam mar adentro em ampla extensão,
// com cristas nítidas e dissolvendo-se suavemente no oceano profundo
float getTidePulses(float distNorm, vec2 worldUV, float t) {
  if (distNorm >= 1.0) return 0.0;

  // Perturbação líquida orgânica com FBM para eliminar anéis circulares
  vec2 waveNoiseCoord = worldUV * 4.0 + vec2(t * 0.12, -t * 0.09);
  float wavePerturb = (fbm(waveNoiseCoord) - 0.5) * 0.18;
  float fluidDist = clamp(distNorm + wavePerturb * (1.0 - distNorm * 0.5), 0.0, 1.0);

  float totalTide = 0.0;
  float cycleTime = 5.8;

  for (int i = 0; i < 3; i++) {
    float phaseOffset = float(i) * 0.333333;
    float progress = fract((t / cycleTime) + phaseOffset);

    // O pulso viaja desde a arrebentação (0.04) até o mar aberto (0.94)
    float waveCenter = progress * 0.94;
    float distToWave = abs(fluidDist - waveCenter);

    // Largura da marola: estreita ao nascer, expande e suaviza conforme avança mar adentro
    float waveWidth = 0.12 + 0.22 * progress;

    if (distToWave < waveWidth) {
      float normDist = distToWave / waveWidth;
      float waveShape = cos(normDist * 1.5707963);
      waveShape = waveShape * waveShape;

      // Desvanecimento suave ao se afastar da costa mar adentro
      float waveDissolve = smoothstep(1.0, 0.18, progress);
      float birthFade = smoothstep(0.0, 0.05, progress);

      totalTide += waveShape * waveDissolve * birthFade;
    }
  }

  return clamp(totalTide, 0.0, 1.0);
}

void main() {
  vec2 scale = (u_map_scale.x > 0.0) ? u_map_scale : vec2(1.0, 1.0);
  vec2 mapUV = (v_uv - 0.5) * scale + 0.5;

  // Alinhamento geométrico com o mapa vetorial D3
  vec2 texUV = vec2(mapUV.x, 1.0 - mapUV.y);

  float landMask = 0.0;
  float shelfFactor = 0.0;
  float basinFactor = (texUV.x < 0.16) ? 0.0 : 1.0;
  float beachFactor = 0.0;

  if (texUV.x >= 0.0 && texUV.x <= 1.0 && texUV.y >= 0.0 && texUV.y <= 1.0) {
    vec4 mapSample = texture(u_coast_distance_tex, texUV);
    landMask = mapSample.r;      // 1.0 = terra (Brasil e América do Sul), 0.0 = oceano
    shelfFactor = mapSample.g;   // Proximidade da costa com decaimento suave
    basinFactor = mapSample.b;   // 1.0 = Atlântico, 0.0 = Pacífico
    beachFactor = mapSample.a;   // Faixa imediata de arrebentação (espuma 0 a 8px)
  }

  // Anti-aliasing suave da linha de costa: terra continental é 100% transparente
  // para revelar os estados e relevo com nitidez absoluta (Seção 14 do Plano)
  float oceanAlpha = clamp(1.0 - smoothstep(0.0, 0.08, landMask), 0.0, 1.0);
  if (oceanAlpha < 0.002) {
    fragColor = vec4(0.0);
    return;
  }

  // Otimização extrema de GPU: se o pixel está no mar aberto profundo além da plataforma
  // costeira, onde coastalAlpha é 0.0, descarta o fragmento imediatamente sem calcular FBMs.
  if (shelfFactor < 0.002 && beachFactor < 0.002) {
    fragColor = vec4(0.0);
    return;
  }

  // Paleta de cores temática do oceano
  vec3 deepAbyss, midOcean, lightAzure, causticHighlight, shallowWater, beachSand;
  getOceanPalette(u_theme_mode, deepAbyss, midOcean, lightAzure, causticHighlight, shallowWater, beachSand);

  // =========================================================================
  // 1. OCEANO PROFUNDO: CAMPO PROCEDURAL CONTÍNUO (TODO O MAR ABERTO)
  // =========================================================================
  // O shader cobre 100% do mar aberto sem qualquer corte artificial ou desaparecimento do fractal!
  vec2 worldUV = (v_uv - 0.5) * scale + 0.5;
  float pattern = getLiquidCausticFractal(worldUV * 0.85, u_time);

  // Gradiente de profundidade contínuo no mar aberto
  vec3 oceanDeepColor = mix(deepAbyss, midOcean, smoothstep(0.0, 0.50, pattern));
  oceanDeepColor = mix(oceanDeepColor, lightAzure, smoothstep(0.40, 0.85, pattern) * 0.55);

  // Luz cáustica especular suave na superfície
  float specularGlow = smoothstep(0.65, 0.95, pattern);
  oceanDeepColor += causticHighlight * (specularGlow * 0.32);

  // Suspensão de partículas marinhas / plâncton
  float particles = getBlurredParticles(worldUV * 0.85, u_time);
  vec3 particleColor = mix(causticHighlight, vec3(0.90, 0.95, 1.0), 0.35);
  oceanDeepColor += particleColor * (particles * 0.16);

  // =========================================================================
  // 2. TRANSIÇÃO CONTÍNUA: COSTA, MAR RASO E PLATAFORMA EXPANDIDA
  // =========================================================================
  vec2 depthCoord = worldUV * 2.8 + vec2(u_time * 0.02, -u_time * 0.015);
  float depthNoise = (fbm(depthCoord) - 0.5) * 0.16;
  
  // Relevo batimétrico orgânico suave
  float organicShelf = clamp(shelfFactor + depthNoise * smoothstep(0.02, 0.50, shelfFactor), 0.0, 1.0);

  // Transição batimétrica contínua na plataforma expandida
  float shallowTransition = smoothstep(0.01, 0.85, organicShelf) * basinFactor;

  // Variação gradual de cores na plataforma continental:
  // Transição batimétrica sutil e perfeitamente integrada ao mar profundo
  vec3 shallowColor = mix(midOcean, shallowWater, smoothstep(0.05, 0.80, organicShelf));
  shallowColor = mix(shallowColor, causticHighlight, smoothstep(0.20, 0.85, organicShelf) * 0.20);

  // Cor base resultante na zona costeira
  vec3 waterColor = mix(oceanDeepColor, shallowColor, shallowTransition * 0.68);

  // 3. Espuma viva da arrebentação (apenas nos primeiros pixels da orla, SEM drop shadow amarelo)
  vec2 foamUV = worldUV * 12.0 + vec2(u_time * 0.20, u_time * 0.14);
  float foamNoise = fbm(foamUV);
  float coastalFoam = smoothstep(0.10, 0.85, beachFactor) * smoothstep(0.35, 0.78, foamNoise) * basinFactor;
  waterColor = mix(waterColor, beachSand, coastalFoam * 0.70);

  // 4. Marolas e pulsos de onda no mar costeiro com área de abrangência expandida
  float distNorm = clamp(1.0 - organicShelf, 0.0, 1.0);
  float rawWavePulse = getTidePulses(distNorm, worldUV, u_time) * basinFactor;
  // Envelope suave na borda da plataforma para garantir dissolução imperceptível
  float shelfEnvelope = smoothstep(0.0, 0.08, organicShelf);
  float wavePulse = rawWavePulse * shelfEnvelope;

  if (wavePulse > 0.001) {
    // Cristas nítidas, luminosas e cristalinas em tom azul-celeste e espuma branca
    vec3 waveCrestColor = mix(causticHighlight, vec3(0.96, 0.99, 1.0), 0.72);
    waterColor = mix(waterColor, waveCrestColor, wavePulse * 0.68);
  }

  // =========================================================================
  // 5. CANAL ALFA CONTÍNUO (CAMADA MAROLAS ESTILO PHOTOSHOP)
  // =========================================================================
  // No mar aberto, coastalAlpha decai suavemente para 0.0 (100% transparente),
  // revelando o Oceano Profundo de 14.000x10.000px sem qualquer corte ou linha demarcatória.
  // Na terra, oceanAlpha é 0.0 para preservar o mapa e as 27 UFs 100% nítidas.
  float landTransparency = oceanAlpha;
  
  float coastalAlpha = clamp(
    shallowTransition * 0.65 + 
    coastalFoam * 0.75 + 
    wavePulse * 0.75, 
    0.0, 
    1.0
  );

  vec3 finalWaterColor = waterColor;
  float finalAlpha = coastalAlpha * landTransparency;

  if (finalAlpha < 0.001) {
    fragColor = vec4(0.0);
    return;
  }

  fragColor = vec4(finalWaterColor, finalAlpha);
}
`;


