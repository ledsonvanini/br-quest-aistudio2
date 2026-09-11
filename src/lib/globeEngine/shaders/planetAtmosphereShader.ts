/**
 * Planetary Atmospheric Scattering Fresnel Shader
 * Simulates Rayleigh & aerosol limb glow for planets with atmospheres
 * (Venus, Mars, Jupiter, Saturn, Uranus, Neptune).
 */
import * as THREE from 'three';

export const PlanetAtmosphereShader = {
  vertexShader: `
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
  `,
  fragmentShader: `
    uniform vec3 u_sunDirection;
    uniform vec3 u_atmosphereColor;
    uniform float u_rimPower;
    uniform float u_intensity;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 norm = normalize(vWorldNormal);
      vec3 viewDir = normalize(vViewDir);
      vec3 sunDir = normalize(u_sunDirection);

      // Fresnel grazing limb factor: 0.0 when looking straight, 1.0 at edge
      float cosTheta = max(dot(norm, viewDir), 0.0);
      float rim = pow(1.0 - cosTheta, u_rimPower);

      // Illumination from the Sun: atmospheric scattering is prominent on the daylit limb
      float sunFacing = dot(norm, sunDir);
      float dayFactor = smoothstep(-0.25, 0.35, sunFacing);

      // Forward Mie scattering towards camera
      float forwardScatter = pow(max(dot(viewDir, -sunDir), 0.0), 8.0) * 0.25 * dayFactor;

      float alpha = rim * (dayFactor * 0.85 + 0.12) * u_intensity + forwardScatter;

      if (alpha < 0.005) {
        discard;
      }

      gl_FragColor = vec4(u_atmosphereColor * 1.25, clamp(alpha, 0.0, 0.95));
    }
  `,
};

const PLANET_ATMOSPHERE_COLORS: Record<string, { color: THREE.Color; rimPower: number; intensity: number }> = {
  venus: {
    color: new THREE.Color(0xfef08a),
    rimPower: 2.8,
    intensity: 0.95,
  },
  marte: {
    color: new THREE.Color(0xfbcfe8),
    rimPower: 3.8,
    intensity: 0.55,
  },
  jupiter: {
    color: new THREE.Color(0xfde68a),
    rimPower: 3.0,
    intensity: 0.70,
  },
  saturno: {
    color: new THREE.Color(0xfef3c7),
    rimPower: 3.2,
    intensity: 0.65,
  },
  urano: {
    color: new THREE.Color(0x67e8f9),
    rimPower: 2.5,
    intensity: 0.90,
  },
  netuno: {
    color: new THREE.Color(0x3b82f6),
    rimPower: 2.5,
    intensity: 0.92,
  },
};

export function createPlanetAtmosphereMesh(
  planetId: string,
  baseRadius: number
): THREE.Mesh | null {
  const config = PLANET_ATMOSPHERE_COLORS[planetId];
  if (!config) return null;

  const geo = new THREE.SphereGeometry(baseRadius * 1.024, 32, 32);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      u_sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      u_atmosphereColor: { value: config.color },
      u_rimPower: { value: config.rimPower },
      u_intensity: { value: config.intensity },
    },
    vertexShader: PlanetAtmosphereShader.vertexShader,
    fragmentShader: PlanetAtmosphereShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `atmosphere-${planetId}`;
  return mesh;
}
