import React from 'react';
import { CartographyLayerMode } from '../../types/cartography';

interface TerritoryLayersOverlayProps {
  activeLayer: CartographyLayerMode;
  hoveredStateId?: string | null;
  selectedStateId?: string | null;
}

/**
 * Dados Cartográficos das Bacias Hidrográficas do Brasil
 * Coordenadas calibradas na malha 1000x1000 do SVG nacional.
 */
const HYDROLOGICAL_BASINS = [
  {
    id: 'amazonica',
    name: 'Bacia Amazônica',
    color: '#06b6d4',
    discharge: '209.000 m³/s',
    area: '6.110.000 km²',
    // Linhas principais do Rio Solimões/Amazonas, Rio Negro e Madeira
    riverPaths: [
      'M 120,380 Q 250,370 380,330 T 600,280 T 780,240', // Rio Solimões / Amazonas
      'M 280,210 Q 340,260 410,320', // Rio Negro
      'M 300,520 Q 360,460 480,360', // Rio Madeira
      'M 490,560 Q 520,450 560,320', // Rio Tapajós
      'M 600,600 Q 640,480 670,300', // Rio Xingu
    ],
    labelPos: { x: 380, y: 260 },
  },
  {
    id: 'tocantins_araguaia',
    name: 'Bacia Tocantins-Araguaia',
    color: '#0ea5e9',
    discharge: '13.600 m³/s',
    area: '920.000 km²',
    riverPaths: [
      'M 580,680 Q 600,540 620,380 T 680,270', // Rio Araguaia
      'M 660,650 Q 670,510 680,380 T 700,280', // Rio Tocantins
    ],
    labelPos: { x: 620, y: 460 },
  },
  {
    id: 'sao_francisco',
    name: 'Bacia do São Francisco',
    color: '#38bdf8',
    discharge: '2.850 m³/s',
    area: '640.000 km²',
    riverPaths: [
      'M 680,720 Q 730,620 760,510 T 820,440 T 900,430', // "Velho Chico" da Canastra à foz no Atlântico
    ],
    labelPos: { x: 770, y: 530 },
  },
  {
    id: 'prata_parana',
    name: 'Bacia do Prata (Paraná / Paraguai)',
    color: '#67e8f9',
    discharge: '16.000 m³/s',
    area: '1.400.000 km²',
    riverPaths: [
      'M 530,680 Q 520,760 510,830', // Rio Paraguai / Pantanal
      'M 650,720 Q 620,770 580,820 T 540,880', // Rio Paraná / Itaipu
      'M 670,780 Q 620,830 540,890', // Rio Tietê / Paranapanema
      'M 550,910 Q 500,940 460,980', // Rio Uruguai
    ],
    labelPos: { x: 580, y: 780 },
  },
];

/**
 * Rotas e Conectividade Histórica / Moderna
 */
const INTEGRATION_ROUTES = [
  {
    id: 'estrada_real',
    name: 'Estrada Real (Ouro & Diamantes)',
    color: '#f59e0b',
    path: 'M 720,710 Q 710,740 700,770 T 730,795', // MG até Paraty / Rio
    kind: 'Histórica (Século XVIII)',
  },
  {
    id: 'br_101',
    name: 'Rodovia BR-101 (Translitorânea)',
    color: '#fbbf24',
    path: 'M 930,370 Q 910,480 870,600 T 770,750 T 680,840 T 560,930 T 490,990', // Touros (RN) ao RS
    kind: 'Rodovia Federal',
  },
  {
    id: 'ferrovia_norte_sul',
    name: 'Ferrovia Norte-Sul',
    color: '#d97706',
    path: 'M 700,280 Q 660,450 630,630 T 600,760 T 590,830', // Açailândia (MA) até Estrela d\'Oeste (SP)
    kind: 'Malha Ferroviária',
  },
];

/**
 * TerritoryLayersOverlay
 * Renderizador de sobreposição SVG para camadas cartográficas temáticas sobre o mapa do Brasil.
 */
export const TerritoryLayersOverlay: React.FC<TerritoryLayersOverlayProps> = ({
  activeLayer,
}) => {
  if (activeLayer === 'none') return null;

  return (
    <g
      id="container-camadas-territorio-overlay"
      className="container-camadas-territorio-overlay pointer-events-none select-none transition-opacity duration-300"
    >
      {/* ========================================================================= */}
      {/* 1. CAMADA DE BACIAS HIDROGRÁFICAS (RIOS VIVOS)                            */}
      {/* ========================================================================= */}
      {activeLayer === 'bacias_hidrograficas' && (
        <g id="camada-bacias-hidrograficas" className="camada-bacias-hidrograficas">
          {HYDROLOGICAL_BASINS.map((basin) => (
            <g key={basin.id} className="grupo-bacia-hidrografica">
              {/* Rios da Bacia com Glow e Traçado Fluido */}
              {basin.riverPaths.map((d, idx) => (
                <React.Fragment key={`${basin.id}-river-${idx}`}>
                  {/* Glow externo */}
                  <path
                    d={d}
                    fill="none"
                    stroke={basin.color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeOpacity="0.35"
                    filter="drop-shadow(0 0 4px rgba(6,182,212,0.8))"
                  />
                  {/* Linha de água central pulsante */}
                  <path
                    d={d}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeOpacity="0.85"
                    strokeDasharray="12 6"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                </React.Fragment>
              ))}

              {/* Rótulo Geográfico da Bacia */}
              <g
                transform={`translate(${basin.labelPos.x}, ${basin.labelPos.y})`}
                className="rotulo-bacia-hidrografica"
              >
                <rect
                  x="-75"
                  y="-14"
                  width="150"
                  height="26"
                  rx="6"
                  fill="#020d24"
                  fillOpacity="0.85"
                  stroke={basin.color}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <text
                  textAnchor="middle"
                  y="2"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {basin.name}
                </text>
              </g>
            </g>
          ))}
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. CAMADA DE ROTAS & INTEGRAÇÃO NACIONAL                                 */}
      {/* ========================================================================= */}
      {activeLayer === 'rotas_integracao' && (
        <g id="camada-rotas-integracao" className="camada-rotas-integracao">
          {INTEGRATION_ROUTES.map((route) => (
            <g key={route.id} className="grupo-rota-integracao">
              {/* Rota com Glow */}
              <path
                d={route.path}
                fill="none"
                stroke={route.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeOpacity="0.4"
              />
              <path
                d={route.path}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 4"
                strokeOpacity="0.9"
              />
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
