/**
 * Atmospheric Scattering (Rayleigh + Mie) & Ozone Chappuis Layer Shader
 * Simulates the true physics of Earth's atmosphere:
 * - Rayleigh scattering (azure blue limb glow during daytime)
 * - Mie scattering (forward sunlight glow)
 * - Chappuis Ozone absorption (deep cobalt-blue and purple/amber terminator at dusk/dawn)
 * - Rendered on an outer shell with zero haze on the camera face
 */
import * as THREE from 'three';

export const AtmosphereVertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const AtmosphereFragmentShader = `
  uniform vec3 u_sunDirection;
  uniform vec3 u_moonDirection;
  uniform float u_moonIntensity;
  uniform vec3 u_rayleighColor;
  uniform vec3 u_ozoneColor;
  uniform vec3 u_sunsetGlowColor;
  uniform float u_intensity;
  uniform float u_enabled;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    if (u_enabled < 0.5) {
      discard;
    }

    vec3 norm = normalize(vWorldNormal);
    vec3 viewDir = normalize(vViewDir);
    vec3 sunDir = normalize(u_sunDirection);
    vec3 moonDir = normalize(u_moonDirection);

    // Precise limb geometry: cosTheta is ~1.0 facing camera, ~0.0 at grazing horizon
    float cosTheta = abs(dot(viewDir, norm));

    // STRICT ISOLATION: Zero atmospheric haze across the planetary face (cosTheta > 0.35)
    // to keep continental map textures, borders, and state shields 100% crisp.
    float limbFactor = smoothstep(0.35, 0.0, cosTheta);
    float rim = pow(limbFactor, 3.5);

    // 1. Solar incidence on atmosphere in world space (Hard Sun)
    float sunFacing = dot(norm, sunDir);
    float sunDayFactor = smoothstep(-0.15, 0.30, sunFacing);

    // 2. Lunar incidence (Soft Box Moon Fill)
    float moonFacing = dot(norm, moonDir);
    float moonFactor = smoothstep(-0.25, 0.40, moonFacing);

    // Sunset / twilight factor along the terminator
    float sunsetFactor = smoothstep(0.20, -0.05, sunFacing) * smoothstep(-0.25, 0.05, sunFacing);

    // Mie forward-scattering (only when illuminated by the sun, never on dark silhouette)
    float mie = pow(max(dot(viewDir, -sunDir), 0.0), 12.0) * 0.12 * rim * sunDayFactor;

    // Chappuis absorption: ozone absorbs orange/yellow, leaving rich stratospheric cobalt & violet
    vec3 baseColor = mix(u_rayleighColor, u_sunsetGlowColor, sunsetFactor * 0.85);
    baseColor = mix(baseColor, u_ozoneColor, rim * 0.45);

    // Soft Moonlight glow on night-side limb facing the Moon
    vec3 moonlightAtmosphere = vec3(0.68, 0.82, 1.0);
    float nightLimb = (1.0 - sunDayFactor) * moonFactor;
    baseColor = mix(baseColor, moonlightAtmosphere, nightLimb * 0.40);

    // Alpha is strictly confined to the razor-thin limb edge, with delicate moonlight presence at night
    float moonAlpha = rim * nightLimb * 0.18 * u_moonIntensity;
    float alpha = rim * (sunDayFactor * 0.85 + 0.04) * u_intensity + mie + moonAlpha;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(baseColor, clamp(alpha, 0.0, 0.90));
  }
`;

export function createAtmosphereMaterial(
  sunDirection: THREE.Vector3,
  moonDirection?: THREE.Vector3,
  enabled = true,
  moonIntensity = 0.65
): THREE.ShaderMaterial {
  const defaultMoonDir = moonDirection
    ? moonDirection.clone()
    : new THREE.Vector3(-0.7, 0.35, 0.6).normalize();

  return new THREE.ShaderMaterial({
    vertexShader: AtmosphereVertexShader,
    fragmentShader: AtmosphereFragmentShader,
    uniforms: {
      u_sunDirection: { value: sunDirection.clone() },
      u_moonDirection: { value: defaultMoonDir },
      u_moonIntensity: { value: moonIntensity },
      u_rayleighColor: { value: new THREE.Color('#38bdf8') }, // Azure Blue
      u_ozoneColor: { value: new THREE.Color('#1e1b4b') }, // Stratospheric Ozone Deep Cobalt/Violet
      u_sunsetGlowColor: { value: new THREE.Color('#f97316') }, // Sunset Amber
      u_intensity: { value: 0.65 },
      u_enabled: { value: enabled ? 1.0 : 0.0 },
    },
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}
