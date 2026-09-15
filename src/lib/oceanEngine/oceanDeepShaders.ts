/**
 * WebGL2 Shaders para o Oceano Profundo (Camada Base Resiliente ao Zoom Out)
 * 
 * Renderiza o fractal de grande escala com cáusticas líquidas orgânicas,
 * partículas marinhas flutuantes e profundidade abissal contínua.
 * Abrange todo o espaço navegável (14.000 x 10.000px) sem qualquer bounding box.
 */

export const OCEAN_DEEP_VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const OCEAN_DEEP_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform int u_theme_mode;

// Paletas temáticas de alta profundidade oceânica
void getDeepOceanPalette(
  int mode, 
  out vec3 deepAbyss, 
  out vec3 midOcean, 
  out vec3 lightAzure, 
  out vec3 causticHighlight
) {
  if (mode == 1) {
    // Biodiversidade: Abismo esmeralda profundo
    deepAbyss        = vec3(0.005, 0.085, 0.110);
    midOcean         = vec3(0.015, 0.260, 0.300);
    lightAzure       = vec3(0.035, 0.650, 0.580);
    causticHighlight = vec3(0.400, 0.950, 0.850);
  } else if (mode == 2) {
    // Musicalidades: Safira acústica noturna
    deepAbyss        = vec3(0.006, 0.050, 0.140);
    midOcean         = vec3(0.020, 0.160, 0.360);
    lightAzure       = vec3(0.100, 0.480, 0.800);
    causticHighlight = vec3(0.550, 0.850, 0.980);
  } else {
    // Aventura, Clima, Geopolítica (Padrão Atlântico Sul Profundo)
    deepAbyss        = vec3(0.006, 0.070, 0.160);
    midOcean         = vec3(0.025, 0.220, 0.420);
    lightAzure       = vec3(0.080, 0.500, 0.750);
    causticHighlight = vec3(0.400, 0.880, 0.960);
  }
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

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

float fbm(vec2 p) {
  float v = 0.0;
  v += 0.55 * smoothNoise(p);
  p = p * 2.04 + vec2(13.5, 27.2);
  v += 0.30 * smoothNoise(p);
  p = p * 2.08 + vec2(42.1, 11.8);
  v += 0.15 * smoothNoise(p);
  return v;
}

// FBM de 2 oitavas para Domain Warping ultrarrápido (reduz 40% de ALU)
float fbmFast(vec2 p) {
  float v = 0.65 * smoothNoise(p);
  v += 0.35 * smoothNoise(p * 2.05 + vec2(13.5, 27.2));
  return v;
}

// Algoritmo de Ondulação Oceânica Contínua e Luz Líquida em Grande Escala (Liquid Caustic Fractal)
float getLiquidCausticFractal(vec2 uv, float t) {
  vec2 p = uv * 3.0;

  // Ondulação oceânica em duas direções cruzadas (período harmônico de respiração suave de ~9s)
  vec2 dir1 = vec2(0.866, 0.500);
  vec2 dir2 = vec2(-0.500, 0.866);

  float swell1 = sin(dot(p, dir1) * 1.5 + t * 0.70);
  float swell2 = cos(dot(p, dir2) * 1.3 - t * 0.55);
  float swell = (swell1 + swell2) * 0.5;

  // Correntezas de alto-mar em grande escala (Domain Warping contínuo e orgânico com fbmFast)
  vec2 flow = vec2(-0.06, 0.04) * t;
  vec2 q = vec2(
    fbmFast(p + flow + swell * 0.20),
    fbmFast(p + vec2(4.3, 1.7) - flow * 0.90 - swell * 0.20)
  );

  vec2 r = vec2(
    fbmFast(p + 1.8 * q + vec2(1.7, 7.4) + vec2(0.04, -0.03) * t),
    fbmFast(p + 1.8 * q + vec2(6.2, 3.1) - vec2(0.03, 0.05) * t)
  );

  // Variação de relevo e profundidade em movimento suave com fbmFast
  float baseDepth = fbmFast(p + 1.5 * r + vec2(0.02, 0.03) * t);

  // Feixes de luz líquida cáustica refratada (ondulação nítida, fluida e serena)
  float caustics1 = sin((baseDepth + q.x * 0.65) * 4.2 + t * 0.65);
  float caustics2 = cos((r.y - q.y * 0.65) * 3.8 - t * 0.55);
  float causticLuminance = (caustics1 * 0.5 + 0.5) * (caustics2 * 0.5 + 0.5);
  causticLuminance = smoothstep(0.22, 0.78, causticLuminance);

  // Micro-reflexos solares e ondulações secundárias
  float microCaustic = sin(dot(p + q * 1.2, vec2(1.6, 1.3)) + t * 0.90) * 0.5 + 0.5;
  microCaustic = smoothstep(0.68, 0.96, microCaustic);

  return clamp(baseDepth * 0.46 + causticLuminance * 0.42 + microCaustic * 0.12, 0.0, 1.0);
}

// Partículas marinhas / plâncton em suspensão com amostragem direta ultra-otimizada (sem loop 3x3)
float getBlurredParticles(vec2 uv, float t) {
  vec2 gridUV = uv * 6.0;
  vec2 id = floor(gridUV);
  vec2 gv = fract(gridUV) - 0.5;
  float h1 = hash21(id);
  float h2 = hash21(id + 31.7);
  vec2 drift = vec2(
    sin(t * 0.50 + h1 * 6.28) * 0.22,
    cos(t * 0.45 + h2 * 6.28) * 0.22
  );
  float d = length(gv - drift);
  float radius = mix(0.16, 0.34, hash21(id + 17.8));
  float blur = smoothstep(radius, 0.0, d);
  float pulse = 0.5 + 0.5 * sin(t * 0.75 + h1 * 6.28);
  return blur * blur * pulse * 0.22;
}

void main() {
  vec3 deepAbyss, midOcean, lightAzure, causticHighlight;
  getDeepOceanPalette(u_theme_mode, deepAbyss, midOcean, lightAzure, causticHighlight);

  // Mapeamento isotrópico para a área navegável de 14.000x10.000px (proporção 14:10 sem distorção)
  vec2 deepUV = vec2(v_uv.x * 14.0, v_uv.y * 10.0) * 0.42;

  // Fractal cáustico contínuo e vivo em todo o oceano profundo
  float pattern = getLiquidCausticFractal(deepUV, u_time);

  vec3 oceanColor = mix(deepAbyss, midOcean, smoothstep(0.0, 0.50, pattern));
  oceanColor = mix(oceanColor, lightAzure, smoothstep(0.40, 0.85, pattern) * 0.65);

  float specularGlow = smoothstep(0.65, 0.95, pattern);
  oceanColor += causticHighlight * (specularGlow * 0.38);

  float particles = getBlurredParticles(deepUV, u_time);
  vec3 particleColor = mix(causticHighlight, vec3(0.90, 0.96, 1.0), 0.40);
  oceanColor += particleColor * (particles * 0.20);

  // O oceano profundo é contínuo, sem recortes ou bounding box, integrado com opacidade equilibrada
  fragColor = vec4(oceanColor, 0.78);
}
`;
