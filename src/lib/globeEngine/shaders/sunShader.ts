/**
 * Procedural Sun Photosphere, Volumetric Halo & Corona GLSL Shaders
 * Generates photorealistic solar plasma with convective granulation,
 * seamless 3D tangent-space normal perturbation, magnetic flares, and volumetric corona glow.
 */
import * as THREE from 'three';
import { GLSL_SIMPLEX_NOISE } from './sunNoise';

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
      float rim = pow(1.0 - cosTheta, 2.5);

      // Organic plasma turbulence along solar limb
      vec3 p = normalize(vLocalPos) * 4.8;
      float turbulence = snoise(p + vec3(0.0, u_time * 0.10, u_time * 0.07)) * 0.25 + 0.75;

      float alpha = rim * turbulence * 0.92;

      vec3 innerGold = vec3(1.0, 0.92, 0.48);
      vec3 outerAmber = vec3(0.98, 0.48, 0.06);
      vec3 glowColor = mix(outerAmber, innerGold, smoothstep(0.2, 0.9, rim));

      gl_FragColor = vec4(glowColor * 1.6, clamp(alpha, 0.0, 0.95));
    }
  `,
};

export const SunVolumetricHaloShader = {
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;

    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;

    void main() {
      vec3 norm = normalize(vWorldNormal);
      vec3 viewDir = normalize(vViewDir);
      float cosTheta = max(dot(norm, viewDir), 0.0);

      // Soft 3D volumetric spherical scattering falloff (never slices through space)
      float rim = pow(1.0 - cosTheta, 3.5);
      float alpha = rim * 0.65;

      vec3 gold = vec3(1.0, 0.75, 0.20);
      vec3 warmAmber = vec3(0.95, 0.35, 0.05);
      vec3 col = mix(warmAmber, gold, rim);

      gl_FragColor = vec4(col * 1.4, alpha);
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

      // Soft continuous radial fade - reaches 0 at edge without hard discard cut
      float radialEdge = smoothstep(1.0, 0.25, dist);
      if (radialEdge <= 0.0001) discard;

      float angle = atan(center.y, center.x);
      float t = u_time * 0.04;

      float ray1 = sin(angle * 12.0 + t * 0.6) * 0.5 + 0.5;
      float ray2 = sin(angle * 24.0 - t * 0.8) * 0.5 + 0.5;
      float plume = snoise(vec3(cos(angle) * 2.8, sin(angle) * 2.8, t * 0.25)) * 0.5 + 0.5;
      float streamers = ray1 * 0.35 + ray2 * 0.25 + plume * 0.40;

      float coreFalloff = exp(-dist * 2.8);
      float streamerGlow = coreFalloff * (0.65 + 0.35 * streamers);
      float intensity = streamerGlow * radialEdge;

      vec3 innerGold = vec3(1.0, 0.88, 0.45);
      vec3 midAmber = vec3(0.98, 0.50, 0.08);
      vec3 outerCrimson = vec3(0.85, 0.22, 0.02);

      vec3 coronaColor = mix(outerCrimson, midAmber, smoothstep(0.04, 0.40, intensity));
      coronaColor = mix(coronaColor, innerGold, smoothstep(0.40, 0.85, intensity));

      gl_FragColor = vec4(coronaColor * 1.25, clamp(intensity * 0.85, 0.0, 0.80));
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

export function createSunVolumetricHaloMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: SunVolumetricHaloShader.vertexShader,
    fragmentShader: SunVolumetricHaloShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
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
