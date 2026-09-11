/**
 * Procedural Sun Photosphere & Corona GLSL Shaders
 * Generates photorealistic solar plasma with convective granulation,
 * seamless 3D tangent-space normal perturbation, magnetic flares, and volumetric corona glow.
 */
import * as THREE from 'three';

const GLSL_SIMPLEX_NOISE = `
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p) {
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      total += snoise(p) * amp;
      p = p * 2.04 + vec3(0.12, 0.28, 0.36);
      amp *= 0.5;
    }
    return total;
  }
`;

export const SunPhotosphereShader = {
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vLocalPosition;
    varying vec3 vViewDir;

    void main() {
      vLocalPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    varying vec3 vWorldNormal;
    varying vec3 vLocalPosition;
    varying vec3 vViewDir;

    ${GLSL_SIMPLEX_NOISE}

    float getPlasmaHeat(vec3 pNorm, float t) {
      vec3 warp = vec3(
        fbm(pNorm * 2.2 + vec3(0.0, t * 0.32, 0.0)),
        fbm(pNorm * 2.2 + vec3(4.3, 1.2, -t * 0.28)),
        fbm(pNorm * 2.2 + vec3(-3.1, -t * 0.30, 3.8))
      );
      float base = fbm(pNorm * 3.4 + warp * 1.15);
      float granules = snoise(pNorm * 9.5 + vec3(t * 0.08, -t * 0.06, t * 0.05)) * 0.26;
      float micro = snoise(pNorm * 18.0 + vec3(0.0, t * 0.16, -t * 0.12)) * 0.12;
      return clamp(base * 0.65 + granules + micro + 0.36, 0.0, 1.0);
    }

    void main() {
      vec3 norm = normalize(vWorldNormal);
      vec3 viewDir = normalize(vViewDir);
      float cosTheta = max(dot(norm, viewDir), 0.0);

      vec3 pNorm = normalize(vLocalPosition);
      float t = u_time * 0.045;

      float heat = getPlasmaHeat(pNorm, t);

      // Seamless 3D gradient in tangent space for normal perturbation
      float eps = 0.025;
      float h0 = heat;
      float hx = getPlasmaHeat(normalize(vLocalPosition + vec3(eps, 0.0, 0.0)), t);
      float hy = getPlasmaHeat(normalize(vLocalPosition + vec3(0.0, eps, 0.0)), t);
      float hz = getPlasmaHeat(normalize(vLocalPosition + vec3(0.0, 0.0, eps)), t);
      vec3 grad = vec3(hx - h0, hy - h0, hz - h0) / eps;
      vec3 tangentGrad = grad - dot(grad, norm) * norm;
      vec3 perturbedNorm = normalize(norm - tangentGrad * 0.14);

      float specularLight = pow(max(dot(perturbedNorm, viewDir), 0.0), 20.0) * 0.42;

      // Solar Heat Palette
      vec3 coreWhite = vec3(1.0, 0.98, 0.94);
      vec3 radiantGold = vec3(1.0, 0.82, 0.24);
      vec3 fieryAmber = vec3(0.96, 0.46, 0.05);
      vec3 deepCrimson = vec3(0.72, 0.12, 0.02);

      vec3 color = mix(fieryAmber, radiantGold, smoothstep(0.18, 0.62, heat));
      color = mix(color, coreWhite, smoothstep(0.62, 0.94, heat));

      // Magnetic Sunspots with Penumbra and Umbra
      float spotNoise = fbm(pNorm * 2.4 + vec3(1.5, 0.0, -2.1));
      if (spotNoise > 0.66) {
        float penumbra = smoothstep(0.66, 0.74, spotNoise);
        float umbra = smoothstep(0.74, 0.84, spotNoise);
        vec3 spotColor = mix(fieryAmber * 0.42, deepCrimson * 0.22, umbra);
        color = mix(color, spotColor, penumbra * 0.88);
      }

      // Eddington Solar Limb Darkening & Chromospheric Rim
      float limbDarkening = 0.42 + 0.58 * pow(cosTheta, 0.52);
      float prominenceRim = pow(1.0 - cosTheta, 3.2) * 1.8;

      color = color * limbDarkening + fieryAmber * prominenceRim + coreWhite * specularLight;
      gl_FragColor = vec4(color * 1.28, 1.0);
    }
  `,
};

export const SunChromosphereGlowShader = {
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;
    varying vec3 vLocalPos;

    void main() {
      vLocalPos = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;
    varying vec3 vLocalPos;

    ${GLSL_SIMPLEX_NOISE}

    void main() {
      vec3 norm = normalize(vWorldNormal);
      vec3 viewDir = normalize(vViewDir);
      float cosTheta = max(dot(norm, viewDir), 0.0);

      // Inverted Fresnel: grazing angles produce intense chromospheric glow
      float rim = pow(1.0 - cosTheta, 2.6);

      // Organic plasma turbulence along solar limb
      vec3 p = normalize(vLocalPos) * 5.2;
      float turbulence = snoise(p + vec3(0.0, u_time * 0.12, u_time * 0.08)) * 0.35 + 0.65;

      float alpha = rim * turbulence * 0.88;
      if (alpha < 0.005) discard;

      vec3 innerGold = vec3(1.0, 0.90, 0.40);
      vec3 outerAmber = vec3(0.98, 0.48, 0.06);
      vec3 glowColor = mix(outerAmber, innerGold, smoothstep(0.3, 0.95, rim));

      gl_FragColor = vec4(glowColor * 1.5, clamp(alpha, 0.0, 0.95));
    }
  `,
};

export const SunCoronaGlowShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    varying vec2 vUv;

    ${GLSL_SIMPLEX_NOISE}

    void main() {
      vec2 center = vUv - vec2(0.5);
      float dist = length(center) * 2.0;

      if (dist >= 1.0) discard;

      // Soft cutout over the Sun's physical sphere so rays never clip or slice the photosphere
      // Normalized radius on 32x32 quad: Sun radius 3.6 / 16.0 = 0.225
      float sunLimb = 0.225;
      float limbFade = smoothstep(sunLimb * 0.88, sunLimb * 1.35, dist);

      float angle = atan(center.y, center.x);
      float t = u_time * 0.05;

      float ray1 = sin(angle * 14.0 + t * 0.75) * 0.5 + 0.5;
      float ray2 = sin(angle * 29.0 - t * 1.05) * 0.5 + 0.5;
      float plume = snoise(vec3(cos(angle) * 3.4, sin(angle) * 3.4, t * 0.32)) * 0.5 + 0.5;
      float streamers = ray1 * 0.36 + ray2 * 0.24 + plume * 0.40;

      float edgeFeather = smoothstep(1.0, 0.22, dist);
      float midCorona = exp(-dist * 3.2) * (0.60 + 0.40 * streamers);
      float outerHalo = exp(-dist * 1.45) * 0.26;

      float intensity = (midCorona + outerHalo) * edgeFeather * limbFade;
      if (intensity < 0.002) discard;

      vec3 innerGold = vec3(1.0, 0.88, 0.44);
      vec3 midAmber = vec3(0.98, 0.52, 0.08);
      vec3 outerCrimson = vec3(0.85, 0.22, 0.02);

      vec3 coronaColor = mix(outerCrimson, midAmber, smoothstep(0.05, 0.45, intensity));
      coronaColor = mix(coronaColor, innerGold, smoothstep(0.45, 0.90, intensity));

      gl_FragColor = vec4(coronaColor * 1.35, clamp(intensity * 1.15, 0.0, 0.85));
    }
  `,
};

export function createSunPhotosphereMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { u_time: { value: 0 } },
    vertexShader: SunPhotosphereShader.vertexShader,
    fragmentShader: SunPhotosphereShader.fragmentShader,
    side: THREE.FrontSide,
  });
}

export function createSunChromosphereMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { u_time: { value: 0 } },
    vertexShader: SunChromosphereGlowShader.vertexShader,
    fragmentShader: SunChromosphereGlowShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
}

export function createSunCoronaGlowMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { u_time: { value: 0 } },
    vertexShader: SunCoronaGlowShader.vertexShader,
    fragmentShader: SunCoronaGlowShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}
