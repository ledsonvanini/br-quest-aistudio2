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

    // Gamma curve & Luminosity Lift to counteract ACES tone mapping crushing darks
    // Lift midtones and shadows so continents and oceans are vibrant and clearly visible
    vec3 dayBase = pow(dayTex.rgb, vec3(0.82));
    // Boost ocean vibrancy (bring out luminous azure, turquoise & royal deep blues)
    vec3 oceanVibrant = mix(dayBase, vec3(0.04, 0.28, 0.62) * (dayBase.b * 2.0 + 0.15), isWater * 0.40);
    // Continental enhancement (lush Amazon emerald, Cerrado savannas, Andes cordillera)
    vec3 dayColorEnhanced = mix(oceanVibrant, dayBase * 1.25, 1.0 - isWater * 0.25) * 1.32;

    // Subtle, crisp Cloud Shadows onto terrain (from the Hard Sun)
    vec2 cloudUv = vUv + vec2(u_cloudsTime * 0.006, 0.0);
    vec2 shadowOffset = -sunDir.xy * 0.003;
    vec4 cloudSample = texture2D(u_cloudsMap, cloudUv + shadowOffset);
    float rawCloudDensity = (cloudSample.a < 0.95) ? cloudSample.a : cloudSample.r;
    float cloudShadow = smoothstep(0.35, 0.80, rawCloudDensity) * 0.15 * u_cloudsOpacity;
    float shadowFactor = 1.0 - cloudShadow * smoothstep(-0.15, 0.18, sunDot);

    // =================================================================================
    // TÉCNICA DE ILUMINAÇÃO DE 3 PONTOS (CINEMATOGRÁFICA / CARTOGRÁFICA)
    // =================================================================================
    
    // 1. SOL - LUZ HARD (KEY LIGHT)
    //    Luz principal direcional com terminador suave, orgânico e natural (sem corte brusco)
    //    Transição difusa ampla de ~25 graus simulando a espessura da atmosfera terrestre
    float sunDayFactor = smoothstep(-0.22, 0.22, sunDot);
    // Half-Lambert / wrap diffuse para iluminação diurna generosa e clara
    float sunDiffuse = pow(max((sunDot + 0.20) / 1.20, 0.0), 1.15);
    vec3 sunLightColor = vec3(1.08, 1.05, 0.98);
    vec3 directSun = dayColorEnhanced * (sunDayFactor * (0.45 + 0.65 * sunDiffuse) * u_sunIntensity * sunLightColor) * shadowFactor;

    // Ocean Specular Reflex do Sol (World-Space Blinn-Phong, nítido e focado)
    vec3 sunHalfVec = normalize(sunDir + vViewDir);
    float specPower = (u_textureMode == 3) ? 28.0 : 48.0;
    float specMult = (u_textureMode == 3) ? 0.75 : 0.45;
    float specFactor = pow(max(dot(norm, sunHalfVec), 0.0), specPower) * isWater;
    vec3 sunSpecularColor = vec3(1.0, 0.96, 0.88) * specFactor * specMult * smoothstep(-0.05, 0.15, sunDot);

    // 2. LUA - LUZ DE PREENCHIMENTO (FILL LIGHT / SOFT BOX NATURAL COM LEVE GLOW)
    //    A Lua atua como uma soft box esférica difusa no espaço sideral.
    //    - Soft Wrap amplo: preenche a face noturna e penumbra com luar azul-prateado
    //    - Tonalidade: prateado etéreo celeste límpido (4800K)
    //    - Leve Glow de borda (Fresnel suave) e Shimmer especular acetinado no oceano
    float moonWrap = smoothstep(-0.45, 0.50, moonDot);
    float moonGlowSurface = pow(max(moonDot, 0.0), 1.5) * 0.20;
    float moonRimGlow = pow(1.0 - max(dot(vViewDir, norm), 0.0), 2.5) * max(moonDot, 0.0) * 0.35;
    
    // Reflexo especular acetinado da Lua na água (Moonlight Glint suave)
    vec3 moonHalfVec = normalize(moonDir + vViewDir);
    float moonSpec = pow(max(dot(norm, moonHalfVec), 0.0), 18.0) * isWater * 0.35 * smoothstep(-0.05, 0.25, moonDot);
    
    vec3 moonlightColor = vec3(0.70, 0.82, 1.0); // Prateado-celeste límpido do luar
    // A luz da Lua atua como preenchimento ideal nas áreas onde o Sol não está pleno (penumbra e noite)
    float fillMask = 1.0 - smoothstep(0.0, 0.40, sunDot);
    vec3 moonFill = dayColorEnhanced * (moonWrap * (moonlightColor + vec3(moonGlowSurface)) * (u_moonIntensity * 0.70)) * fillMask;
    vec3 moonHighlights = moonlightColor * (moonSpec + moonRimGlow * 0.30) * u_moonIntensity * fillMask;

    // 3. AMBIENT LIGHT - LUZ FAKE SUAVE PARA PREENCHER PEQUENOS GAPS
    //    Luz omnidirecional fake suave com base de luminescência cartográfica noturna,
    //    garantindo que o relevo, continentes e fronteiras nunca desapareçam na escuridão total.
    vec3 ambientColor = vec3(0.08, 0.14, 0.24); // Tonalidade azul-profundo de céu noturno
    vec3 ambientFill = dayColorEnhanced * (u_ambientIntensity * 1.6) + ambientColor * (u_ambientIntensity * 0.45);

    // Iluminação combinada de 3 Pontos + Especulares
    vec3 threePointIllumination = directSun + moonFill + moonHighlights + ambientFill + sunSpecularColor;

    // 4. NASA VIIRS Black Marble City Lights (Nocturnal Radiance)
    vec4 nightTex = texture2D(u_nightMap, vUv);
    vec3 warmCityColor = mix(vec3(1.0, 0.85, 0.45), vec3(1.0, 0.95, 0.75), nightTex.r);
    // As luzes das cidades brilham no lado noturno e crepúsculo suave
    float nightMask = 1.0 - smoothstep(-0.15, 0.12, sunDot);
    vec3 nightRadiance = nightTex.rgb * warmCityColor * (u_cityLightIntensity * 1.7) * nightMask;

    // 5. Suave calor crepuscular orgânico no terminador (apenas nos continentes, sem manchar o oceano)
    float terminatorEdge = smoothstep(-0.14, 0.02, sunDot) * smoothstep(0.20, 0.04, sunDot);
    vec3 sunsetWarmth = vec3(1.0, 0.65, 0.35) * terminatorEdge * 0.10 * (1.0 - isWater * 0.7);

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
