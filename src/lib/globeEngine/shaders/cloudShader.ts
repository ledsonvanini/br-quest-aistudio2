/**
 * Atmospheric Cloud Layer Shader with Zonal Wind Drift & Solar Illumination
 */
import * as THREE from 'three';

export const CloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Standard upright UV coordinates matching spherical geography
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const CloudFragmentShader = `
  uniform sampler2D u_cloudsMap;
  uniform vec3 u_sunDirection;
  uniform vec3 u_moonDirection;
  uniform float u_moonIntensity;
  uniform float u_time;
  uniform float u_opacity;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Zonal wind velocity: faster drift near the equator (trade winds)
    float latFactor = cos((vUv.y - 0.5) * 3.14159);
    vec2 driftingUv = vUv + vec2(u_time * (0.0018 + 0.0012 * latFactor), 0.0);

    // Primary cloud texture sampling
    vec4 cloudTex = texture2D(u_cloudsMap, driftingUv);
    
    // Support both RGBA maps and grayscale maps
    float cloudDensity = (cloudTex.a < 0.95) ? cloudTex.a : cloudTex.r;

    // Discrete cloud threshold: allows crystal-clear oceans and continents below
    float cloudAlphaCurve = smoothstep(0.16, 0.72, cloudDensity);

    // Discard empty cloud areas immediately so zero veil touches the ocean or land
    if (cloudAlphaCurve < 0.015) {
      discard;
    }

    vec3 norm = normalize(vWorldNormal);
    vec3 sunDir = normalize(u_sunDirection);
    vec3 moonDir = normalize(u_moonDirection);
    float sunDot = dot(norm, sunDir);
    float moonDot = dot(norm, moonDir);

    // 1. SOL (LUZ HARD)
    float cloudSunFactor = smoothstep(-0.20, 0.22, sunDot);
    vec3 noonColor = vec3(1.0, 1.0, 1.0);
    vec3 sunsetColor = vec3(1.0, 0.82, 0.62);
    float terminatorProximity = clamp(1.0 - abs(sunDot * 3.5), 0.0, 1.0);
    vec3 sunLitCloud = mix(noonColor, sunsetColor, terminatorProximity * 0.42);

    // 2. LUA (LUZ DE PREENCHIMENTO / SOFT BOX COM LEVE GLOW)
    // Nuvens noturnas voltadas para a Lua são banhadas por um prateado etéreo difuso
    float moonCloudWrap = smoothstep(-0.30, 0.40, moonDot);
    vec3 moonlightColor = vec3(0.72, 0.84, 1.02);
    vec3 moonLitCloud = moonlightColor * (moonCloudWrap * (u_moonIntensity * 0.45));

    // 3. BASE NOTURNA / AMBIENTE
    vec3 deepNightBase = vec3(0.04, 0.06, 0.10);
    vec3 nightSideCloud = deepNightBase + moonLitCloud;

    // Combinar Dia e Noite
    vec3 finalCloudColor = mix(nightSideCloud, sunLitCloud, cloudSunFactor);

    // Translucidez realista das nuvens (com leve presença prateada à noite sob luar)
    float alpha = cloudAlphaCurve * u_opacity * (cloudSunFactor * 0.82 + (moonCloudWrap * u_moonIntensity * 0.18 + 0.08));

    gl_FragColor = vec4(finalCloudColor, clamp(alpha, 0.0, 0.45));
  }
`;

export function createCloudShaderMaterial(
  cloudsTexture: THREE.Texture | null,
  sunDirection: THREE.Vector3,
  moonDirection?: THREE.Vector3,
  opacity = 0.20,
  moonIntensity = 0.65
): THREE.ShaderMaterial {
  const defaultMoonDir = moonDirection
    ? moonDirection.clone()
    : new THREE.Vector3(-0.7, 0.35, 0.6).normalize();

  return new THREE.ShaderMaterial({
    vertexShader: CloudVertexShader,
    fragmentShader: CloudFragmentShader,
    uniforms: {
      u_cloudsMap: { value: cloudsTexture },
      u_sunDirection: { value: sunDirection.clone() },
      u_moonDirection: { value: defaultMoonDir },
      u_moonIntensity: { value: moonIntensity },
      u_time: { value: 0.0 },
      u_opacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
  });
}
