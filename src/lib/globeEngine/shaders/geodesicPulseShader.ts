/**
 * Geodesic Pulse Shader for Great-Circle Arcs
 * Renders glowing routes between Brazilian states with animated energy pulses.
 */
import * as THREE from 'three';

export const GeodesicPulseVertexShader = `
  attribute float a_progress;
  varying float vProgress;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vProgress = a_progress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const GeodesicPulseFragmentShader = `
  uniform vec3 u_baseColor;
  uniform vec3 u_pulseColor;
  uniform float u_time;
  uniform float u_active;

  varying float vProgress;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    if (u_active < 0.1) {
      discard;
    }

    // Base luminous transparent arc line
    float baseAlpha = 0.32;

    // Travelling energy pulse (speed & wavelength)
    float pulsePos = fract(u_time * 0.45);
    float distToPulse = abs(vProgress - pulsePos);
    
    // Smooth pulse bell curve with trailing tail
    float pulse = smoothstep(0.16, 0.0, distToPulse);
    // Trailing comet tail effect
    float tail = smoothstep(0.35, 0.0, mod(pulsePos - vProgress + 1.0, 1.0)) * 0.45;

    // Tube edge Fresnel rim glow if normal exists
    float rim = 1.0;
    if (length(vNormal) > 0.1) {
      rim = 0.85 + 0.25 * abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    }

    vec3 color = mix(u_baseColor, u_pulseColor, pulse * 0.95 + tail) * rim;
    float alpha = clamp((baseAlpha + pulse * 0.75 + tail * 0.35) * rim, 0.0, 0.95);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function createGeodesicPulseMaterial(
  baseColor = '#38bdf8',
  pulseColor = '#fbbf24'
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: GeodesicPulseVertexShader,
    fragmentShader: GeodesicPulseFragmentShader,
    uniforms: {
      u_baseColor: { value: new THREE.Color(baseColor) },
      u_pulseColor: { value: new THREE.Color(pulseColor) },
      u_time: { value: 0.0 },
      u_active: { value: 1.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
