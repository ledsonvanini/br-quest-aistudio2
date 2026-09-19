/**
 * routesStateColors.ts
 * Mapa de Cores Temático e Específico para o Modo 'Rotas & Conectividade'
 * Identifica os grandes eixos de integração nacional, portos de cabotagem,
 * corredores ferroviários de grãos/minério e calhas hidroviárias.
 */

export interface RouteStateStyle {
  fill: string;
  stroke: string;
  glow: string;
  wall: string;
  axisName: string;
}

export const LOGISTIC_CORRIDOR_STATE_COLORS: Record<string, RouteStateStyle> = {
  // 1. Grandes Hubs Portuários & Cabotagem Oceânica (Azul Marinho / Ciano Elétrico)
  SP: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Hub Portuário de Santos & Rodoanel' },
  RJ: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Complexo Portuário de Itaguaí & Açu' },
  ES: { fill: '#0c4a6e', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Corredor EFVM & Porto de Tubarão' },
  PA: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Arco Norte / Porto de Barcarena' },
  MA: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'EFC & Porto do Itaqui / Ponta da Madeira' },
  PE: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Complexo Industrial e Portuário de Suape' },
  BA: { fill: '#0c4a6e', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Porto de Salvador, Aratu e FIOL' },
  SC: { fill: '#0c4a6e', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Hub de Cabotagem de Itajaí & Navegantes' },
  RS: { fill: '#082f49', stroke: '#38bdf8', glow: '#0284c7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Superporto de Rio Grande & Eixo Sul' },

  // 2. Corredores Ferroviários & Agro-Logística de Grãos (Âmbar / Dourado Logístico)
  MT: { fill: '#451a03', stroke: '#f59e0b', glow: '#fbbf24', wall: 'url(#extrusionWallGradGold)', axisName: 'Corredor Agro BR-163 & Rumo Malha Norte' },
  MS: { fill: '#451a03', stroke: '#f59e0b', glow: '#fbbf24', wall: 'url(#extrusionWallGradGold)', axisName: 'Rota Bioceânica & Malha Oeste' },
  GO: { fill: '#422006', stroke: '#eab308', glow: '#facc15', wall: 'url(#extrusionWallGradGold)', axisName: 'Espinha Dorsal Ferrovia Norte-Sul' },
  TO: { fill: '#422006', stroke: '#eab308', glow: '#facc15', wall: 'url(#extrusionWallGradGold)', axisName: 'Tramo Central da Ferrovia Norte-Sul' },
  RO: { fill: '#451a03', stroke: '#f59e0b', glow: '#fbbf24', wall: 'url(#extrusionWallGradGold)', axisName: 'Corredor Fluvial do Madeira & BR-364' },

  // 3. Eixos Tronco Rodoviários e Conexões Históricas (Cobre / Laranja / Carmesim)
  MG: { fill: '#431407', stroke: '#f97316', glow: '#fb923c', wall: 'url(#extrusionWallGradGold)', axisName: 'Tronco Rodoviário BR-040, 381 e 116' },
  PR: { fill: '#431407', stroke: '#f97316', glow: '#fb923c', wall: 'url(#extrusionWallGradGold)', axisName: 'Corredor de Exportação BR-277 & Paranaguá' },

  // 4. Hidrovias e Calha Fluvial Amazônica (Verde Florestal Navegável)
  AM: { fill: '#064e3b', stroke: '#10b981', glow: '#34d399', wall: 'url(#extrusionWallGradEmerald)', axisName: 'Calha Hidroviária Solimões-Amazonas' },
  AC: { fill: '#064e3b', stroke: '#10b981', glow: '#34d399', wall: 'url(#extrusionWallGradEmerald)', axisName: 'Extremo Oeste & Conexão Pacífico BR-364' },
  AP: { fill: '#064e3b', stroke: '#10b981', glow: '#34d399', wall: 'url(#extrusionWallGradEmerald)', axisName: 'Foz Transfronteiriça & Porto de Santana' },
  RR: { fill: '#064e3b', stroke: '#10b981', glow: '#34d399', wall: 'url(#extrusionWallGradEmerald)', axisName: 'Eixo Setentrional BR-174 (Pacaraima)' },

  // 5. Eixos de Integração e Cabotagem Nordeste (Púrpura / Violeta Conectado)
  CE: { fill: '#3b0764', stroke: '#c084fc', glow: '#e879f9', wall: 'url(#extrusionWallGradCyan)', axisName: 'Porto de Pecém & Hub Transnordestina' },
  RN: { fill: '#3b0764', stroke: '#c084fc', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Terminal Salineiro & Conexão BR-101' },
  PB: { fill: '#3b0764', stroke: '#c084fc', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Porto de Cabedelo & BR-230' },
  AL: { fill: '#3b0764', stroke: '#c084fc', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Eixo Costeiro BR-101 & Porto de Maceió' },
  SE: { fill: '#3b0764', stroke: '#c084fc', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Terminal Portuário de Sergipe & BR-101' },
  PI: { fill: '#3b0764', stroke: '#c084fc', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)', axisName: 'Corredor Graneleiro MATOPIBA & Parnaíba' },

  // 6. Distrito Federal (Nó Geodésico e Rodoviário Central)
  DF: { fill: '#311005', stroke: '#facc15', glow: '#fef08a', wall: 'url(#extrusionWallGradGold)', axisName: 'Marco Zero Rodoviário Nacional' },
};

export function getRouteStateStyle(stateId: string, isSelected: boolean, isHovered: boolean) {
  const corridor = LOGISTIC_CORRIDOR_STATE_COLORS[stateId] || {
    fill: '#0f172a',
    stroke: '#38bdf8',
    glow: '#0284c7',
    wall: 'url(#extrusionWallGradCyan)',
    axisName: 'Eixo de Transporte',
  };

  return {
    stateFill: corridor.fill,
    stateFillOpacity: isSelected ? 0.98 : isHovered ? 0.92 : 0.82,
    strokeColor: isSelected ? '#fde047' : isHovered ? '#ffffff' : corridor.stroke,
    strokeWidth: isSelected ? 3.6 : isHovered ? 2.8 : 1.6,
    underglowColor: isSelected ? '#facc15' : corridor.glow,
    wallGradId: corridor.wall,
  };
}
