/**
 * Relevo Hipsométrico, Picos Culminantes e Chapadas do Brasil
 * Coordenadas calibradas para o Canvas 2560x1440 (D3 Mercator centrado em Goiás).
 */

export interface ReliefPeak {
  id: string;
  name: string;
  altitudeMeters: number;
  rankBr: number;
  mountainRange: string;
  state: string;
  x: number;
  y: number;
  geologicalEra: string;
  notableFeatures: string;
}

export interface ReliefChapada {
  id: string;
  name: string;
  state: string;
  altitudeMeters: number;
  x: number;
  y: number;
  description: string;
}

export interface MountainRidgePath {
  id: string;
  name: string;
  d: string;
  state: string;
}

export const BRAZIL_MAJOR_PEAKS: ReliefPeak[] = [
  {
    id: 'pico-da-neblina',
    name: 'Pico da Neblina',
    altitudeMeters: 2995,
    rankBr: 1, // PONTO MAIS ALTO DO BRASIL!
    mountainRange: 'Serra do Imeri (Planalto das Guianas)',
    state: 'AM',
    x: 820,
    y: 215,
    geologicalEra: 'Escudo das Guianas (Pré-Cambriano > 1.8 bi anos)',
    notableFeatures: 'Localizado no Parque Nacional do Pico da Neblina em terra indígena Yanomami.',
  },
  {
    id: 'pico-31-marco',
    name: 'Pico 31 de Março',
    altitudeMeters: 2974,
    rankBr: 2,
    mountainRange: 'Serra do Imeri',
    state: 'AM',
    x: 825,
    y: 220,
    geologicalEra: 'Formação Roraima / Pré-Cambriano',
    notableFeatures: 'Fronteira binacional entre o Brasil e a Venezuela.',
  },
  {
    id: 'pico-da-bandeira',
    name: 'Pico da Bandeira',
    altitudeMeters: 2892,
    rankBr: 3,
    mountainRange: 'Serra do Caparaó',
    state: 'MG/ES',
    x: 1475,
    y: 815,
    geologicalEra: 'Cinturão Ribeira / Brasiliano',
    notableFeatures: 'Ponto culminante da Região Sudeste com campos de altitude e geadas intensas.',
  },
  {
    id: 'pedra-da-mina',
    name: 'Pedra da Mina',
    altitudeMeters: 2798,
    rankBr: 4,
    mountainRange: 'Serra da Mantiqueira',
    state: 'SP/MG',
    x: 1410,
    y: 865,
    geologicalEra: 'Planalto Cristalino da Mantiqueira',
    notableFeatures: 'Ponto culminante do Estado de São Paulo na Serra Fina.',
  },
  {
    id: 'agulhas-negras',
    name: 'Pico das Agulhas Negras',
    altitudeMeters: 2791,
    rankBr: 5,
    mountainRange: 'Maciço do Itatiaia (Mantiqueira)',
    state: 'RJ/MG',
    x: 1435,
    y: 875,
    geologicalEra: 'Maciço Alcalino de Itatiaia',
    notableFeatures: 'Primeiro Parque Nacional criado no Brasil (1937) com penedos escarpados.',
  },
  {
    id: 'monte-roraima',
    name: 'Monte Roraima (Tepui)',
    altitudeMeters: 2734,
    rankBr: 8,
    mountainRange: 'Serra de Pacaraima',
    state: 'RR',
    x: 955,
    y: 195,
    geologicalEra: 'Tepui Pré-Cambriano (Formação arenítica mais antiga da Terra)',
    notableFeatures: 'Tríplice fronteira Brasil, Venezuela e Guiana; inspiração para The Lost World.',
  },
  {
    id: 'pico-parana',
    name: 'Pico Paraná',
    altitudeMeters: 1877,
    rankBr: 12,
    mountainRange: 'Serra do Mar',
    state: 'PR',
    x: 1265,
    y: 955,
    geologicalEra: 'Complexo Cristalino Costeiro',
    notableFeatures: 'Ponto mais alto da Região Sul do Brasil.',
  },
  {
    id: 'morro-da-igreja',
    name: 'Morro da Igreja & Pedra Furada',
    altitudeMeters: 1822,
    rankBr: 15,
    mountainRange: 'Serra Geral (Aparados da Serra)',
    state: 'SC',
    x: 1245,
    y: 1040,
    geologicalEra: 'Derrames Basálticos da Formação Serra Geral',
    notableFeatures: 'Ponto habitado mais frio do Brasil (-17,8°C em 1996) e base do radar CINDACTA.',
  },
  {
    id: 'pico-das-almas',
    name: 'Pico das Almas',
    altitudeMeters: 1958,
    rankBr: 10,
    mountainRange: 'Chapada Diamantina (Serra do Espinhaço)',
    state: 'BA',
    x: 1470,
    y: 665,
    geologicalEra: 'Supergrupo Espinhaço',
    notableFeatures: 'Ponto culminante do Nordeste Oriental com campos rupestres e orquídeas raras.',
  },
  {
    id: 'dedo-de-deus',
    name: 'Dedo de Deus',
    altitudeMeters: 1692,
    rankBr: 20,
    mountainRange: 'Serra dos Órgãos',
    state: 'RJ',
    x: 1455,
    y: 885,
    geologicalEra: 'Granitoide Brasiliano',
    notableFeatures: 'Monumento natural e berço do montanhismo técnico nacional.',
  },
];

export const BRAZIL_NOTABLE_CHAPADAS: ReliefChapada[] = [
  {
    id: 'chapada-veadeiros',
    name: 'Chapada dos Veadeiros',
    state: 'GO',
    altitudeMeters: 1650,
    x: 1315,
    y: 690,
    description: 'Planalto de quartzo pré-cambriano, cânions cristalinos e cachoeiras patrimônio da UNESCO.',
  },
  {
    id: 'chapada-diamantina',
    name: 'Chapada Diamantina',
    state: 'BA',
    altitudeMeters: 1400,
    x: 1485,
    y: 650,
    description: 'Morro do Pai Inácio, Poço Azul, Cachoeira da Fumaça (340m) e berço do Rio Paraguaçu.',
  },
  {
    id: 'chapada-guimaraes',
    name: 'Chapada dos Guimarães',
    state: 'MT',
    altitudeMeters: 860,
    x: 1145,
    y: 665,
    description: 'Paredões de arenito avermelhado na borda geológica do Pantanal e Cachoeira Véu de Noiva.',
  },
  {
    id: 'chapada-araripe',
    name: 'Chapada do Araripe',
    state: 'CE/PE/PI',
    altitudeMeters: 1000,
    x: 1530,
    y: 505,
    description: 'Primeiro Geoparque das Américas (Geopark Araripe) com fósseis preservados do Cretáceo.',
  },
];

export const MOUNTAIN_RIDGES: MountainRidgePath[] = [
  // Serra da Mantiqueira (SP/MG/RJ)
  { id: 'ridge-mantiqueira', name: 'Serra da Mantiqueira', state: 'SP/MG/RJ', d: 'M 1370,890 Q 1415,865 1450,860' },
  // Serra do Mar (PR/SP/RJ)
  { id: 'ridge-serra-mar', name: 'Serra do Mar', state: 'PR/SP/RJ', d: 'M 1270,965 Q 1340,920 1440,895' },
  // Serra do Espinhaço (MG/BA)
  { id: 'ridge-espinhaco', name: 'Serra do Espinhaço', state: 'MG/BA', d: 'M 1435,800 Q 1460,720 1480,630' },
  // Serra Geral / Aparados da Serra (RS/SC)
  { id: 'ridge-serra-geral', name: 'Serra Geral (Cânions)', state: 'RS/SC', d: 'M 1230,1070 Q 1245,1035 1255,990' },
];
