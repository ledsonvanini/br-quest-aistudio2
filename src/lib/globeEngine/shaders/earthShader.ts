/**
 * Photorealistic Earth Day/Night Shader with VIIRS City Lights & Ocean Specular
 */
import * as THREE from 'three';

export const EarthDayNightVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    // Standard upright UV coordinates matching 3D spherical geography
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const EarthDayNightFragmentShader = `
  uniform sampler2D u_dayMap;
  uniform sampler2D u_nightMap;
  uniform sampler2D u_cloudsMap;
  uniform vec3 u_sunDirection;
  uniform vec3 u_moonDirection;
  uniform float u_sunIntensity;         // 1. Sol - Luz Hard (Key Light)
  uniform float u_moonIntensity;        // 2. Lua - Luz de Preenchimento / Soft Box Natural
  uniform float u_ambientIntensity;     // 3. Ambient Light - Luz Fake para gaps de sombra
  uniform float u_cityLightIntensity;
  uniform float u_cloudsOpacity;
  uniform float u_cloudsTime;
  uniform int u_textureMode; // 0: nasa_satellite, 1: blue_marble_day, 2: night_lights, 3: specular_topo, 4: sst, 5: hydrology

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    vec3 norm = normalize(vWorldNormal);
    vec3 sunDir = normalize(u_sunDirection);
    vec3 moonDir = normalize(u_moonDirection);
    float sunDot = dot(norm, sunDir);
    float moonDot = dot(norm, moonDir);

    // Day Albedo (Blue Marble / Satellite)
    vec4 dayTex = texture2D(u_dayMap, vUv);

    // Estimate ocean water mask based on blue dominance and low red/green
    float isWater = clamp((dayTex.b - dayTex.r * 1.05) * 2.0, 0.0, 1.0);

    // Natural tone mapping: boost midtones without crushing blacks or washing out highlights
    vec3 dayBase = pow(dayTex.rgb, vec3(0.92)) * 1.18;
    // Subtle, gentle contrast curve to maintain clean terrain definition
    vec3 dayContrast = dayBase * dayBase * (3.0 - 2.0 * dayBase);
    dayBase = mix(dayBase, dayContrast, 0.18);

    // Ocean vibrancy (deep crystal sapphire, luminous coastal turquoise)
    vec3 oceanVibrant = mix(dayBase * vec3(0.65, 0.85, 1.15), vec3(0.04, 0.18, 0.42) * (dayBase.b * 1.6 + 0.35), isWater * 0.65);
    // Continental enhancement (lush Amazon emerald, savanna gold, Andes cordillera)
    vec3 dayColorEnhanced = mix(oceanVibrant, dayBase * vec3(1.02, 1.12, 1.05), 1.0 - isWater * 0.5);

    // Subtle, crisp Cloud Shadows onto terrain
    vec2 cloudUv = vUv + vec2(u_cloudsTime * 0.006, 0.0);
    vec2 shadowOffset = -sunDir.xy * 0.003;
    vec4 cloudSample = texture2D(u_cloudsMap, cloudUv + shadowOffset);
    float rawCloudDensity = (cloudSample.a < 0.95) ? cloudSample.a : cloudSample.r;
    float cloudShadow = smoothstep(0.35, 0.80, rawCloudDensity) * 0.15 * u_cloudsOpacity;
    float shadowFactor = 1.0 - cloudShadow * smoothstep(-0.15, 0.20, sunDot);

    // =================================================================================
    // TÉCNICA DE ILUMINAÇÃO DE 3 PONTOS (CINEMATOGRÁFICA / CARTOGRÁFICA)
    // =================================================================================
    
    // 1. SOL - LUZ DIRETA (KEY LIGHT)
    // Transição suave no terminador para alvorecer e entardecer sem cortes abruptos
    float sunDayFactor = smoothstep(-0.18, 0.18, sunDot);
    // Half-Lambert diffuse com iluminação rica em relevos
    float sunDiffuse = max((sunDot + 0.22) / 1.22, 0.0);
    vec3 sunLightColor = vec3(1.08, 1.05, 0.98);
    vec3 directSun = dayColorEnhanced * (sunDayFactor * (0.40 + 0.70 * sunDiffuse) * u_sunIntensity * sunLightColor) * shadowFactor;

    // Ocean Specular Reflex do Sol (World-Space Blinn-Phong nítido)
    vec3 sunHalfVec = normalize(sunDir + vViewDir);
    float specPower = (u_textureMode == 3) ? 32.0 : 48.0;
    float specMult = (u_textureMode == 3) ? 0.90 : 0.70;
    float specFactor = pow(max(dot(norm, sunHalfVec), 0.0), specPower) * isWater;
    vec3 sunSpecularColor = vec3(1.0, 0.96, 0.88) * specFactor * specMult * smoothstep(-0.05, 0.15, sunDot);

    // 2. LUA - LUZ DE PREENCHIMENTO (FILL LIGHT / SOFT BOX NATURAL COM LEVE GLOW)
    float moonWrap = smoothstep(-0.40, 0.45, moonDot);
    float moonGlowSurface = pow(max(moonDot, 0.0), 1.6) * 0.22;
    float moonRimGlow = pow(1.0 - max(dot(vViewDir, norm), 0.0), 2.5) * max(moonDot, 0.0) * 0.45;
    
    // Reflexo especular suave da Lua na água
    vec3 moonHalfVec = normalize(moonDir + vViewDir);
    float moonSpec = pow(max(dot(norm, moonHalfVec), 0.0), 20.0) * isWater * 0.45 * smoothstep(-0.05, 0.20, moonDot);
    
    vec3 moonlightColor = vec3(0.70, 0.84, 1.0); // Prateado-celeste límpido do luar
    float fillMask = 1.0 - smoothstep(-0.10, 0.40, sunDot);
    vec3 moonFill = dayColorEnhanced * (moonWrap * (moonlightColor + vec3(moonGlowSurface)) * (u_moonIntensity * 0.85)) * fillMask;
    vec3 moonHighlights = moonlightColor * (moonSpec + moonRimGlow * 0.40) * u_moonIntensity * fillMask;

    // 3. AMBIENT LIGHT - LUZ DE BASE (EARTHSHINE & STARLIGHT - NUNCA ESCURO DEMAIS)
    vec3 ambientSpaceColor = vec3(0.12, 0.18, 0.32); // Azul-marinho estelar suave
    vec3 ambientFill = dayColorEnhanced * (max(u_ambientIntensity, 0.25) * 1.5) + ambientSpaceColor * (max(u_ambientIntensity, 0.25) * 0.65);

    // Iluminação combinada de 3 Pontos + Especulares
    vec3 threePointIllumination = directSun + moonFill + moonHighlights + ambientFill + sunSpecularColor;

    // 4. NASA VIIRS Black Marble City Lights (Nocturnal Radiance brilhante e calorosa)
    vec4 nightTex = texture2D(u_nightMap, vUv);
    vec3 warmCityColor = mix(vec3(1.0, 0.82, 0.38), vec3(1.0, 0.94, 0.72), nightTex.r);
    float nightMask = 1.0 - smoothstep(-0.12, 0.10, sunDot);
    vec3 nightRadiance = nightTex.rgb * warmCityColor * (u_cityLightIntensity * 3.0) * nightMask;

    // 5. Calor crepuscular no terminador (Aura dourada no pôr do sol)
    float terminatorEdge = smoothstep(-0.16, 0.02, sunDot) * smoothstep(0.22, 0.02, sunDot);
    vec3 sunsetWarmth = vec3(1.0, 0.65, 0.32) * terminatorEdge * 0.28 * (1.0 - isWater * 0.5);

    vec3 composite = threePointIllumination + nightRadiance + sunsetWarmth;

    // Apply Texture Mode overrides
    if (u_textureMode == 1) {
      // 1: NASA Blue Marble Diurna Global (100% Daylight illumination, no dark side)
      composite = dayTex.rgb * 1.15 + (sunSpecularColor * 0.5);
    } else if (u_textureMode == 2) {
      // 2: Global Night Lights (NASA Black Marble everywhere, glowing cities worldwide)
      vec3 fullNightAmbient = vec3(0.08, 0.10, 0.15) * dayTex.rgb;
      composite = fullNightAmbient + (nightTex.rgb * warmCityColor * (u_cityLightIntensity * 2.2));
    } else if (u_textureMode == 3) {
      // 3: Specular Topography (Enhanced bathymetry & topography with high specular reflex)
      vec3 topoTint = mix(dayTex.rgb, vec3(0.12, 0.42, 0.32) * (dayTex.g * 1.6), 1.0 - isWater);
      composite = (topoTint * (u_ambientIntensity * 0.8 + sunDayFactor * 0.8)) + (sunSpecularColor * 1.7);
    } else if (u_textureMode == 4) {
      // 4: SST & El Niño Thermal Anomaly (Pacific Warm Pool & Ocean Currents)
      float latNorm = abs(vUv.y - 0.5) * 2.0; // 0 at equator, 1 at poles
      float warmPool = (1.0 - smoothstep(0.0, 0.38, latNorm));
      vec3 coldOcean = vec3(0.02, 0.12, 0.38);
      vec3 warmSst = mix(vec3(0.95, 0.55, 0.15), vec3(0.98, 0.18, 0.12), warmPool);
      vec3 sstColor = mix(coldOcean, warmSst, warmPool);
      if (isWater > 0.45) {
        composite = mix(sstColor, dayTex.rgb, 0.25) + sunSpecularColor * 0.8;
      } else {
        composite = dayTex.rgb * 0.75;
      }
    } else if (u_textureMode == 5) {
      // 5: Hydrology & Flooding NDWI (Amazon Basin, Pantanal, Aquifers and Rivers)
      float waterMoisture = isWater;
      vec3 moistureMap = mix(vec3(0.18, 0.15, 0.12), vec3(0.05, 0.75, 0.65), waterMoisture + dayTex.g * 0.5);
      composite = mix(dayTex.rgb * 0.6, moistureMap, 0.65) + sunSpecularColor * 0.6;
    }

    gl_FragColor = vec4(composite, 1.0);
  }
`;

export function createEarthShaderMaterial(uniforms: {
  dayMap: THREE.Texture | null;
  nightMap: THREE.Texture | null;
  cloudsMap: THREE.Texture | null;
  sunDirection: THREE.Vector3;
  moonDirection?: THREE.Vector3;
  sunIntensity?: number;
  moonIntensity?: number;
  ambientIntensity?: number;
  cityLightIntensity?: number;
  textureMode?: number;
}): THREE.ShaderMaterial {
  const defaultMoonDir = uniforms.moonDirection
    ? uniforms.moonDirection.clone()
    : new THREE.Vector3(-0.7, 0.35, 0.6).normalize();

  return new THREE.ShaderMaterial({
    vertexShader: EarthDayNightVertexShader,
    fragmentShader: EarthDayNightFragmentShader,
    uniforms: {
      u_dayMap: { value: uniforms.dayMap },
      u_nightMap: { value: uniforms.nightMap },
      u_cloudsMap: { value: uniforms.cloudsMap },
      u_sunDirection: { value: uniforms.sunDirection.clone() },
      u_moonDirection: { value: defaultMoonDir },
      u_sunIntensity: { value: uniforms.sunIntensity ?? 1.15 },
      u_moonIntensity: { value: uniforms.moonIntensity ?? 0.65 },
      u_ambientIntensity: { value: uniforms.ambientIntensity ?? 0.14 },
      u_cityLightIntensity: { value: uniforms.cityLightIntensity ?? 1.2 },
      u_cloudsOpacity: { value: 0.45 },
      u_cloudsTime: { value: 0.0 },
      u_textureMode: { value: uniforms.textureMode ?? 0 },
    },
  });
}
