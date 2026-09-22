import React from 'react';

/**
 * Microengine de Shaders Cartográficos Procedurais & Filtros SVG
 * Atua como ponte entre Preenchimento <-> Shaders por Skills nos 6 Modos
 * 
 * Substitui patterns mecânicos rasos por shaders procedurais baseados em
 * feTurbulence, feDiffuseLighting (Hillshade Orográfico), feDisplacementMap
 * e gradientes contínuos de isolinhas geofísicas conformes aos padrões USGS/IBGE.
 */
export const MapCartographicTextures: React.FC = () => {
  return (
    <>
      <defs>
        {/* ========================================================================= */}
        {/* SHADERS PROCEDURAIS (FILTROS DE SUPERFÍCIE GEOFÍSICA)                    */}
        {/* ========================================================================= */}

        {/* 1. Shader Hillshade Orográfico 3D (Relevo sombreado com luz a 315° e altitude 45°) */}
        <filter id="shader-relief-hillshade" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves="4" result="noiseRelief" />
          <feDiffuseLighting in="noiseRelief" lightingColor="#f8fafc" surfaceScale="2.8" diffuseConstant="0.85" result="lightRelief">
            <feDistantLight azimuth="315" elevation="48" />
          </feDiffuseLighting>
          <feBlend in="SourceGraphic" in2="lightRelief" mode="multiply" />
        </filter>

        {/* 2. Shader Onda Térmica Convectiva ENSO (El Niño / La Niña) */}
        <filter id="shader-enso-heatwave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.04" numOctaves="3" result="heatTurb" />
          <feColorMatrix
            in="heatTurb"
            type="matrix"
            values="1 0 0 0 0.8
                    0 0.3 0 0 0.2
                    0 0 0.1 0 0.05
                    0 0 0 0.45 0"
            result="heatTint"
          />
          <feBlend in="SourceGraphic" in2="heatTint" mode="screen" />
        </filter>

        {/* 3. Shader Dossel Vegetal Granular (Biodiversidade / Biomas) */}
        <filter id="shader-biomes-canopy" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.08" numOctaves="3" result="canopyNoise" />
          <feColorMatrix
            in="canopyNoise"
            type="matrix"
            values="0.1 0 0 0 0.05
                    0 0.8 0 0 0.35
                    0 0 0.3 0 0.15
                    0 0 0 0.35 0"
            result="chlorophyllTint"
          />
          <feComposite in="SourceGraphic" in2="chlorophyllTint" operator="arithmetic" k1="0" k2="0.85" k3="0.25" k4="0" />
        </filter>

        {/* ========================================================================= */}
        {/* PADRÕES VETORIAIS DE ALTA DENSIDADE (TEXTURAS SHADER-GRADE)               */}
        {/* ========================================================================= */}

        {/* El Niño: Seca Severa no Norte/Nordeste (Aridez Convectiva Ondulada em Âmbar/Vermelho) */}
        <pattern id="pattern-enso-drought" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <path
            d="M 0 7 Q 7 2, 14 7 T 28 7 M 0 21 Q 7 16, 14 21 T 28 21"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.6"
            strokeOpacity="0.48"
          />
          <circle cx="14" cy="14" r="1.8" fill="#f97316" fillOpacity="0.38" />
        </pattern>

        {/* El Niño: Inundações Torrenciais no Sul (Padrão de Rios e Frentes Estacionárias Ciano/Azul) */}
        <pattern id="pattern-enso-flood" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
          <path
            d="M 0 6 C 6 2, 12 10, 18 6 S 24 10, 28 6 M 0 18 C 6 14, 12 22, 18 18 S 24 22, 28 18"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeOpacity="0.55"
          />
          <line x1="6" y1="12" x2="18" y2="12" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3" />
        </pattern>

        {/* La Niña: Chuvas e Refrigeração (Verde-Esmeralda / Azul-Petróleo) */}
        <pattern id="pattern-la-nina-rain" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="4" y1="2" x2="4" y2="10" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.48" />
          <line x1="14" y1="10" x2="14" y2="18" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.48" />
        </pattern>

        {/* Isolinhas Térmicas Sutis (Contínuas de Alta Precisão) */}
        <pattern id="pattern-thermal-isolines" width="36" height="36" patternUnits="userSpaceOnUse">
          <path
            d="M 0 18 C 9 9, 18 27, 27 18 S 36 9, 45 18 M 0 36 C 9 27, 18 45, 27 36 S 36 27, 45 36"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.1"
            strokeOpacity="0.35"
            strokeDasharray="5 3"
          />
        </pattern>

        {/* Curvas de Nível Topográficas Hipsométricas (Território / Relevo) */}
        <pattern id="pattern-relief-contour" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M 0 10 C 8 4, 15 16, 22 10 S 30 16, 38 10 M 0 25 C 8 19, 15 31, 22 25 S 30 31, 38 25"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeOpacity="0.42"
          />
        </pattern>

        {/* Hidrografia das Bacias ANA (Ramificações Fluviais) */}
        <pattern id="pattern-hydro-basin" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
          <path
            d="M 0 16 Q 8 8, 16 16 T 32 16 M 16 16 L 24 8 M 8 12 L 12 6"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.6"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </pattern>

        {/* Malha de Integração Multimodal e Redes */}
        <pattern id="pattern-rail-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="10" x2="20" y2="10" stroke="#f59e0b" strokeWidth="1.8" strokeOpacity="0.55" />
          <line x1="5" y1="5" x2="5" y2="15" stroke="#fbbf24" strokeWidth="1.4" strokeOpacity="0.45" />
          <line x1="15" y1="5" x2="15" y2="15" stroke="#fbbf24" strokeWidth="1.4" strokeOpacity="0.45" />
        </pattern>

        {/* Dossel Florestal Denso (Amazônia e Mata Atlântica) */}
        <pattern id="pattern-canopy-dense" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="3.2" fill="#10b981" fillOpacity="0.4" />
          <circle cx="14" cy="14" r="3.8" fill="#059669" fillOpacity="0.45" />
          <circle cx="14" cy="4" r="2.0" fill="#34d399" fillOpacity="0.35" />
        </pattern>

        {/* Caatinga Xerófila */}
        <pattern id="pattern-caatinga-thorn" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 6 18 L 11 6 L 16 18 M 8 13 L 14 13" fill="none" stroke="#f59e0b" strokeWidth="1.4" strokeOpacity="0.45" />
          <circle cx="11" cy="4" r="1.5" fill="#d97706" fillOpacity="0.5" />
        </pattern>

        {/* Cerrado Savânico */}
        <pattern id="pattern-cerrado-savanna" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 6 20 Q 12 14 12 6 M 12 11 Q 18 8 20 5 M 10 15 Q 5 12 3 10" fill="none" stroke="#eab308" strokeWidth="1.5" strokeOpacity="0.45" />
        </pattern>

        {/* Pampa e Gramíneas */}
        <pattern id="pattern-pampa-grass" width="16" height="16" patternUnits="userSpaceOnUse">
          <line x1="4" y1="14" x2="6" y2="3" stroke="#84cc16" strokeWidth="1.4" strokeOpacity="0.48" />
          <line x1="10" y1="14" x2="12" y2="2" stroke="#65a30d" strokeWidth="1.4" strokeOpacity="0.48" />
        </pattern>

        {/* Pantanal Alagável */}
        <pattern id="pattern-pantanal-wetland" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 2 12 C 6 7, 11 17, 16 12 S 22 7, 24 12" fill="none" stroke="#06b6d4" strokeWidth="1.6" strokeOpacity="0.55" />
          <circle cx="12" cy="7" r="2.2" fill="#22d3ee" fillOpacity="0.4" />
        </pattern>

        {/* Micromalha Densitária Alta (> 100 hab/km² - SP, RJ, DF) */}
        <pattern id="pattern-density-high" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.2" fill="#f8fafc" fillOpacity="0.5" />
        </pattern>

        {/* Micromalha Densitária Média */}
        <pattern id="pattern-density-mid" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="1.6" fill="#cbd5e1" fillOpacity="0.38" />
        </pattern>

        {/* Complexos Geoeconômicos */}
        <pattern id="pattern-geiger-stripes" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="9" x2="18" y2="9" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.3" />
        </pattern>

        {/* Ranhuras Físicas de Vinil Musical */}
        <pattern id="pattern-vinyl-grooves" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="#f59e0b" strokeWidth="1.0" strokeOpacity="0.45" />
          <circle cx="7" cy="7" r="2.5" fill="none" stroke="#fbbf24" strokeWidth="1.0" strokeOpacity="0.38" />
        </pattern>

        {/* Linhas de Rumo Cartográficas / Aventura */}
        <pattern id="pattern-adventure-rhumb" width="34" height="34" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="34" y2="34" stroke="#fde047" strokeWidth="0.9" strokeOpacity="0.28" />
          <line x1="34" y1="0" x2="0" y2="34" stroke="#fde047" strokeWidth="0.9" strokeOpacity="0.28" />
          <circle cx="17" cy="17" r="2.0" fill="#facc15" fillOpacity="0.42" />
        </pattern>
      </defs>
    </>
  );
};
