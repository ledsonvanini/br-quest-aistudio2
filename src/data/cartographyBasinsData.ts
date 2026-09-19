/**
 * Dados Cartográficos Enriquecidos das Bacias, Biomas, Rotas e Estatísticas do Brasil
 * Coordenadas cartográficas calibradas para o Canvas 2560x1440 (D3 Mercator centrado em Goiás).
 */

export interface HydrologicalBasinDetail {
  id: string;
  name: string;
  color: string;
  discharge: string;
  area: string;
  mainRivers: string[];
  keyFeatures: string[];
  riverPaths: string[];
  mouthPos: { x: number; y: number; label: string };
  labelPos: { x: number; y: number };
}

export interface BiomeRelevoDetail {
  id: string;
  name: string;
  color: string;
  fillColor: string;
  areaKm2: string;
  percentageBr: string;
  floraFauna: string;
  relevoHighlights: string;
  texturePatternId: string;
  regionCenter: { x: number; y: number };
  boundaryPath: string;
}

export interface IntegrationRouteDetail {
  id: string;
  name: string;
  type: 'rodoviaria' | 'ferroviaria' | 'fluvial_cabotagem' | 'historica';
  typeLabel: string;
  color: string;
  strokeDash?: string;
  lengthKm: string;
  path: string;
  cities: { name: string; x: number; y: number; isPort?: boolean }[];
  description: string;
}

export interface PortCabotagePoint {
  id: string;
  name: string;
  type: 'porto_maritimo' | 'porto_fluvial';
  cargo: string;
  state: string;
  x: number;
  y: number;
}

/**
 * 1. Bacias Hidrográficas do Brasil (Projetadas em 2560x1440)
 */
export const ENRICHED_HYDROLOGICAL_BASINS: HydrologicalBasinDetail[] = [
  {
    id: 'amazonica',
    name: 'Bacia Amazônica',
    color: '#06b6d4',
    discharge: '209.000 m³/s (1/5 do deflúvio global)',
    area: '6.110.000 km² (3.800.000 km² no Brasil)',
    mainRivers: ['Rio Amazonas', 'Rio Solimões', 'Rio Negro', 'Rio Madeira', 'Rio Tapajós', 'Rio Xingu'],
    keyFeatures: ['Encontro das Águas (Manaus)', 'Pororoca na Foz', 'Navegação transcontinental de calado profundo'],
    riverPaths: [
      // Rio Solimões / Amazonas da tríplice fronteira (Tabatinga) passando por Manaus, Santarém até a Foz no Atlântico (Marajó/Macapá)
      'M 570,450 Q 750,420 1013,382 T 1180,350 T 1315,338 T 1360,335',
      // Rio Negro (vindo de Roraima/Colômbia até Manaus)
      'M 820,240 Q 920,310 1013,382',
      // Rio Madeira (vindo de Rondônia/Bolívia até o Solimões)
      'M 840,640 Q 920,530 1060,400',
      // Rio Tapajós (vindo do Mato Grosso por Santarém até o Amazonas)
      'M 1080,680 Q 1120,530 1180,360',
      // Rio Xingu (do Parque do Xingu até Altamira/Volta Grande)
      'M 1220,680 Q 1260,510 1265,370',
      // Rio Juruá / Purus (afluentes da margem direita do Acre/Amazonas)
      'M 650,560 Q 760,520 890,440',
    ],
    mouthPos: { x: 1360, y: 335, label: 'Foz do Rio Amazonas (Canal do Norte/Sul)' },
    labelPos: { x: 920, y: 340 },
  },
  {
    id: 'tocantins_araguaia',
    name: 'Bacia Tocantins-Araguaia',
    color: '#0ea5e9',
    discharge: '13.600 m³/s',
    area: '920.000 km² (100% em solo brasileiro)',
    mainRivers: ['Rio Tocantins', 'Rio Araguaia', 'Ilha do Bananal'],
    keyFeatures: ['UHE Tucuruí', 'Maior ilha fluvial do mundo (Bananal)', 'Hidrovia Tocantins'],
    riverPaths: [
      // Rio Araguaia (fronteira GO/MT/TO/PA até confluência com Tocantins em Marabá)
      'M 1190,750 Q 1230,620 1250,500 T 1280,390',
      // Rio Tocantins (nascentes no Planalto Central/DF por Palmas e Tucuruí até Baía do Marajó)
      'M 1320,720 Q 1315,560 1290,450 T 1285,350',
    ],
    mouthPos: { x: 1290, y: 345, label: 'Foz do Tocantins (Baía de Guajará / Belém)' },
    labelPos: { x: 1270, y: 560 },
  },
  {
    id: 'sao_francisco',
    name: 'Bacia do São Francisco ("Velho Chico")',
    color: '#38bdf8',
    discharge: '2.850 m³/s',
    area: '640.000 km²',
    mainRivers: ['Rio São Francisco', 'Rio das Velhas', 'Rio Grande', 'Rio Corrente'],
    keyFeatures: ['Integração Nacional Sudeste-Nordeste', 'Cânion do Xingó', 'Transposição do São Francisco', 'UHE Sobradinho'],
    riverPaths: [
      // Da Serra da Canastra (MG), passando por Pirapora, Juazeiro/Petrolina, Paulo Afonso até a Foz (AL/SE)
      'M 1370,820 Q 1420,720 1460,610 T 1540,540 T 1630,570',
      // Afluente Rio das Velhas
      'M 1410,830 Q 1415,780 1430,730',
    ],
    mouthPos: { x: 1630, y: 570, label: 'Foz do São Francisco (Piaçabuçu - AL / Brejo Grande - SE)' },
    labelPos: { x: 1475, y: 640 },
  },
  {
    id: 'prata_parana',
    name: 'Bacia Platina (Paraná, Paraguai & Uruguai)',
    color: '#67e8f9',
    discharge: '16.000 m³/s (Paraná) + 3.800 m³/s (Paraguai)',
    area: '1.400.000 km² (em território brasileiro)',
    mainRivers: ['Rio Paraná', 'Rio Paraguai', 'Rio Tietê', 'Rio Paranapanema', 'Rio Iguaçu', 'Rio Uruguai'],
    keyFeatures: ['UHE Itaipu Binacional', 'Cataratas do Iguaçu', 'Hidrovia Tietê-Paraná', 'Pantanal Matogrossense'],
    riverPaths: [
      // Rio Paraguai (descendo de Cáceres/Corumbá até a foz no Prata)
      'M 1080,720 Q 1075,807 1060,930',
      // Rio Paraná (encontro Grande/Paranaíba descendo por Ilha Solteira, Itaipu até Argentina)
      'M 1290,810 Q 1240,880 1190,960 T 1160,1030',
      // Rio Tietê (nascentes na Serra do Mar descendo para o interior em direção ao Paraná)
      'M 1370,930 Q 1310,910 1240,890',
      // Rio Iguaçu (de Curitiba às Cataratas)
      'M 1300,975 Q 1240,980 1180,990',
      // Rio Uruguai (fronteira SC/RS descendo para a bacia platina)
      'M 1250,1030 Q 1180,1050 1130,1080',
    ],
    mouthPos: { x: 1160, y: 1030, label: 'Foz de Foz do Iguaçu / Marco das Três Fronteiras' },
    labelPos: { x: 1170, y: 890 },
  },
];

/**
 * 2. Biomas Continentais e Feições de Relevo
 */
export const ENRICHED_BIOMES: BiomeRelevoDetail[] = [
  {
    id: 'amazonia',
    name: 'Amazônia',
    color: '#059669',
    fillColor: '#064e3b',
    areaKm2: '4.196.943 km²',
    percentageBr: '49,3% do Território',
    floraFauna: 'Maior banco genético do planeta: Castanheira, Samaúma, Onça-pintada, Arara-azul.',
    relevoHighlights: 'Planície Amazônica, Planalto das Guianas (Pico da Neblina 2.995m) e Depressão Marginal.',
    texturePatternId: 'pattern-floresta-densa',
    regionCenter: { x: 920, y: 380 },
    boundaryPath: 'M 550,420 Q 750,220 980,210 Q 1230,220 1340,320 Q 1330,460 1200,520 Q 1050,680 840,680 Q 640,620 550,420 Z',
  },
  {
    id: 'cerrado',
    name: 'Cerrado (Savana Tropical)',
    color: '#d97706',
    fillColor: '#78350f',
    areaKm2: '2.036.448 km²',
    percentageBr: '23,9% do Território',
    floraFauna: 'Berço das Águas: Pequizeiro, Buriti, Lobo-guará, Tamanduá-bandeira.',
    relevoHighlights: 'Planalto Central Brasileiro, Chapada dos Veadeiros, Chapada dos Guimarães e Espigões.',
    texturePatternId: 'pattern-savana-cerrado',
    regionCenter: { x: 1280, y: 680 },
    boundaryPath: 'M 1080,590 Q 1260,500 1380,560 Q 1460,700 1390,830 Q 1240,860 1140,780 Q 1060,690 1080,590 Z',
  },
  {
    id: 'caatinga',
    name: 'Caatinga (Semiárido Exclusivo)',
    color: '#db2777',
    fillColor: '#831843',
    areaKm2: '844.453 km²',
    percentageBr: '9,9% do Território',
    floraFauna: 'Exclusivamente brasileiro: Mandacaru, Juazeiro, Ararinha-spix, Tatu-bola.',
    relevoHighlights: 'Depressão Sertaneja, Planalto da Borborema e Chapada do Araripe.',
    texturePatternId: 'pattern-semiarido-caatinga',
    regionCenter: { x: 1540, y: 490 },
    boundaryPath: 'M 1420,410 Q 1580,390 1660,450 Q 1650,560 1560,630 Q 1450,590 1420,480 Z',
  },
  {
    id: 'mata_atlantica',
    name: 'Mata Atlântica',
    color: '#16a34a',
    fillColor: '#14532d',
    areaKm2: '1.110.182 km²',
    percentageBr: '13,0% do Território',
    floraFauna: 'Hotspot mundial de biodiversidade: Pau-brasil, Jequitibá-rosa, Mico-leão-dourado.',
    relevoHighlights: 'Serra do Mar, Serra da Mantiqueira (Pico da Bandeira 2.892m) e Escarpas Litorâneas.',
    texturePatternId: 'pattern-escarpas-atlanticas',
    regionCenter: { x: 1440, y: 840 },
    boundaryPath: 'M 1660,490 Q 1600,640 1520,780 Q 1420,900 1320,990 Q 1240,1050 1280,1020 Q 1420,890 1540,740 Q 1640,590 1660,490 Z',
  },
  {
    id: 'pantanal',
    name: 'Pantanal',
    color: '#06b6d4',
    fillColor: '#0e7490',
    areaKm2: '150.355 km²',
    percentageBr: '1,8% do Território',
    floraFauna: 'Maior planície inundável: Vitória-régia, Camalote, Tuiuiú (ave símbolo), Jacaré-do-pantanal.',
    relevoHighlights: 'Bacia Sedimentar do Alto Paraguai, cordilheiras arenosas e baías inundáveis sazonais.',
    texturePatternId: 'pattern-planicie-alagavel',
    regionCenter: { x: 1090, y: 770 },
    boundaryPath: 'M 1060,710 Q 1120,720 1130,790 Q 1110,840 1060,830 Q 1040,770 1060,710 Z',
  },
  {
    id: 'pampa',
    name: 'Pampa (Campos Sulinos)',
    color: '#8b5cf6',
    fillColor: '#4c1d95',
    areaKm2: '176.496 km²',
    percentageBr: '2,1% do Território',
    floraFauna: 'Gramíneas campestres, Capim-forquilha, Quero-quero, Veado-campeiro.',
    relevoHighlights: 'Coxilhas suaves (relevo ondulado colinoso), Planície Costeira e Lagoa dos Patos.',
    texturePatternId: 'pattern-coxilhas-pampa',
    regionCenter: { x: 1180, y: 1130 },
    boundaryPath: 'M 1120,1090 Q 1230,1070 1250,1130 Q 1220,1190 1140,1180 Q 1100,1140 1120,1090 Z',
  },
];

/**
 * 3. Rotas de Conectividade, Ferrovias, Rodovias e Cabotagem
 */
export const ENRICHED_INTEGRATION_ROUTES: IntegrationRouteDetail[] = [
  {
    id: 'br_101',
    name: 'Rodovia BR-101 (Translitorânea)',
    type: 'rodoviaria',
    typeLabel: 'Rodovia Federal Estratégica',
    color: '#fbbf24',
    lengthKm: '4.658 km',
    // Touros/RN -> Natal -> João Pessoa -> Recife -> Maceió -> Aracaju -> Salvador -> Vitória -> Rio de Janeiro -> Santos/SP -> Florianópolis -> Osório/RS
    path: 'M 1663,452 Q 1671,512 1630,570 T 1577,643 T 1514,817 T 1454,917 T 1372,947 T 1285,1030 T 1244,1125',
    cities: [
      { name: 'Touros (Marco Zero)', x: 1665, y: 440 },
      { name: 'Natal', x: 1663, y: 452 },
      { name: 'Recife', x: 1671, y: 512 },
      { name: 'Salvador', x: 1577, y: 643 },
      { name: 'Vitória', x: 1514, y: 817 },
      { name: 'Rio de Janeiro', x: 1454, y: 917 },
      { name: 'Santos', x: 1372, y: 947, isPort: true },
      { name: 'Florianópolis', x: 1285, y: 1030 },
      { name: 'Osório / Porto Alegre', x: 1244, y: 1125 },
    ],
    description: 'A maior rodovia litorânea do país, conectando 12 estados desde o Rio Grande do Norte até o Rio Grande do Sul.',
  },
  {
    id: 'ferrovia_norte_sul',
    name: 'Ferrovia Norte-Sul (EF-151)',
    type: 'ferroviaria',
    typeLabel: 'Espinha Dorsal Ferroviária',
    color: '#f59e0b',
    strokeDash: '8 5',
    lengthKm: '4.155 km',
    // Porto de Itaqui/São Luís (MA) -> Açailândia -> Palmas -> Anápolis/Brasília -> Estrela d\'Oeste -> Porto de Santos (SP)
    path: 'M 1423,368 Q 1380,450 1315,561 T 1320,720 T 1290,850 T 1372,947',
    cities: [
      { name: 'Porto do Itaqui', x: 1423, y: 368, isPort: true },
      { name: 'Palmas', x: 1315, y: 561 },
      { name: 'Anápolis / Brasília', x: 1320, y: 720 },
      { name: 'Estrela d\'Oeste', x: 1290, y: 850 },
      { name: 'Porto de Santos', x: 1372, y: 947, isPort: true },
    ],
    description: 'Espinha dorsal do escoamento do agronegócio e bens industriais entre o Norte/Centro-Oeste e os portos de Santos e Itaqui.',
  },
  {
    id: 'rota_bioceanica',
    name: 'Corredor Rodoviário Bioceânico (Atlântico - Pacífico)',
    type: 'rodoviaria',
    typeLabel: 'Corredor Internacional Mercosul',
    color: '#34d399',
    lengthKm: '2.396 km',
    // Porto de Santos -> Campo Grande -> Porto Murtinho (fronteira Paraguai) em direção ao Pacífico (Chile)
    path: 'M 1372,947 Q 1260,890 1143,838 T 1075,807 T 990,830',
    cities: [
      { name: 'Porto de Santos', x: 1372, y: 947, isPort: true },
      { name: 'Campo Grande', x: 1143, y: 838 },
      { name: 'Porto Murtinho', x: 1075, y: 807, isPort: true },
    ],
    description: 'Ligação estratégica unindo o Porto de Santos (Oceano Atlântico) aos portos chilenos de Antofagasta e Iquique (Oceano Pacífico).',
  },
  {
    id: 'estrada_real',
    name: 'Estrada Real (Caminho Novo & Velho)',
    type: 'historica',
    typeLabel: 'Patrimônio Histórico do Ciclo do Ouro',
    color: '#eab308',
    strokeDash: '4 4',
    lengthKm: '1.630 km',
    // Diamantina -> Ouro Preto -> São João del-Rei -> Paraty / Rio de Janeiro
    path: 'M 1430,740 Q 1420,780 1410,810 T 1430,860 T 1454,917',
    cities: [
      { name: 'Diamantina', x: 1430, y: 740 },
      { name: 'Ouro Preto', x: 1420, y: 780 },
      { name: 'Paraty / Rio de Janeiro', x: 1454, y: 917, isPort: true },
    ],
    description: 'Maior rota turística histórica do Brasil, utilizada pela Coroa Portuguesa no século XVIII para escoamento do ouro e diamantes.',
  },
  {
    id: 'cabotagem_atlantica',
    name: 'Linha de Cabotagem Mercantil do Atlântico',
    type: 'fluvial_cabotagem',
    typeLabel: 'Navegação Costeira Marítima',
    color: '#06b6d4',
    strokeDash: '10 6',
    lengthKm: '7.491 km de Litoral',
    // Santos -> Paranaguá -> Rio de Janeiro -> Vitória -> Salvador -> Suape/Recife -> Itaqui
    path: 'M 1320,1000 Q 1385,960 1465,930 T 1530,825 T 1595,645 T 1690,510 T 1680,440 T 1440,350',
    cities: [
      { name: 'Porto de Paranaguá', x: 1315, y: 992, isPort: true },
      { name: 'Porto de Santos', x: 1372, y: 947, isPort: true },
      { name: 'Porto do Rio de Janeiro', x: 1454, y: 917, isPort: true },
      { name: 'Porto de Tubarão / Vitória', x: 1514, y: 817, isPort: true },
      { name: 'Porto de Salvador / Aratu', x: 1577, y: 643, isPort: true },
      { name: 'Porto de Suape', x: 1671, y: 512, isPort: true },
      { name: 'Porto do Itaqui', x: 1423, y: 368, isPort: true },
    ],
    description: 'Rotas marinhas de cabotagem responsáveis pelo abastecimento de contêineres, grãos e minérios entre os grandes portos brasileiros.',
  },
];

/**
 * 4. Principais Portos Nacionais de Cabotagem e Exportação
 */
export const BRAZIL_KEY_PORTS: PortCabotagePoint[] = [
  { id: 'porto-santos', name: 'Porto de Santos', type: 'porto_maritimo', cargo: 'Maior complexo portuário da América Latina (Contêineres, Soja, Açúcar)', state: 'SP', x: 1372, y: 947 },
  { id: 'porto-paranagua', name: 'Porto de Paranaguá', type: 'porto_maritimo', cargo: 'Maior polo exportador de grãos e fertilizantes do Sul', state: 'PR', x: 1315, y: 992 },
  { id: 'porto-itaqui', name: 'Porto do Itaqui', type: 'porto_maritimo', cargo: 'Corredor Centro-Norte (Minério de Ferro de Carajás e Soja)', state: 'MA', x: 1423, y: 368 },
  { id: 'porto-suape', name: 'Porto de Suape', type: 'porto_maritimo', cargo: 'Hub industrial e de combustíveis do Nordeste', state: 'PE', x: 1671, y: 512 },
  { id: 'porto-tubarao', name: 'Porto de Tubarão', type: 'porto_maritimo', cargo: 'Maior porto mineraleiro de exportação de pelotas de ferro (Vale)', state: 'ES', x: 1514, y: 817 },
  { id: 'porto-manaus', name: 'Porto Fluvial de Manaus', type: 'porto_fluvial', cargo: 'Polo Industrial da Zona Franca e navegação no Solimões/Amazonas', state: 'AM', x: 1013, y: 382 },
];

export interface StateHydrologyAndTerritoryInfo {
  stateId: string;
  name: string;
  basinName: string;
  basinDischarge: string;
  mainRivers: string[];
  hydrologyHighlights: string;
  biome: string;
  relevo: string;
  routes: string[];
  ports: string[];
}

export const STATE_HYDROLOGY_AND_TERRITORY_DETAILS: Record<string, StateHydrologyAndTerritoryInfo> = {
  AC: {
    stateId: 'AC',
    name: 'Acre',
    basinName: 'Bacia Amazônica (Sub-bacia do Acre-Purus)',
    basinDischarge: 'Afluentes de alta vazão fluvial da margem direita amazônica',
    mainRivers: ['Rio Acre', 'Rio Purus', 'Rio Juruá', 'Rio Tarauacá'],
    hydrologyHighlights: 'Navegação fluvial essencial para comunidades isoladas e biodiversidade de várzeas.',
    biome: 'Amazônia (100%)',
    relevo: 'Depressão da Amazônia Ocidental e Planalto Rebaixado (altitude média 150m)',
    routes: ['Rodovia BR-364 (Ligação Rio Branco - Porto Velho - Cruzeiro do Sul)'],
    ports: ['Porto Fluvial de Rio Branco', 'Porto Fluvial de Cruzeiro do Sul'],
  },
  AL: {
    stateId: 'AL',
    name: 'Alagoas',
    basinName: 'Bacia do São Francisco e Bacias Costeiras do Atlântico Leste',
    basinDischarge: '2.850 m³/s no Rio São Francisco',
    mainRivers: ['Rio São Francisco (Foz)', 'Rio Mundaú', 'Rio Paraíba do Meio'],
    hydrologyHighlights: 'Foz do "Velho Chico" em Piaçabuçu com canais e dunas costeiras; Complexo Lagunar Mundaú-Manguaba.',
    biome: 'Mata Atlântica e Caatinga (Sertão Alagoano)',
    relevo: 'Planície Litorânea, Tabuleiros Costeiros e Planalto da Borborema',
    routes: ['Rodovia Translitorânea BR-101', 'BR-316'],
    ports: ['Porto de Maceió (Jaraguá - Açúcar e Combustíveis)'],
  },
  AP: {
    stateId: 'AP',
    name: 'Amapá',
    basinName: 'Bacia Amazônica e Bacia do Atlântico Norte',
    basinDischarge: 'Estuário da Foz Amazônica com fenômeno da Pororoca',
    mainRivers: ['Rio Amazonas (Canal do Norte)', 'Rio Oiapoque', 'Rio Araguari'],
    hydrologyHighlights: 'Oiapoque marca a fronteira internacional ao norte; encontro das águas doces com o mar aberto.',
    biome: 'Amazônia (97%)',
    relevo: 'Planície Aluvial Litorânea e Planalto das Guianas',
    routes: ['Rodovia BR-156 (Macapá - Oiapoque - Guiana Francesa)'],
    ports: ['Porto de Santana (Minérios, Madeiras e Grãos)'],
  },
  AM: {
    stateId: 'AM',
    name: 'Amazonas',
    basinName: 'Bacia Amazônica (Maior bacia hidrográfica do mundo)',
    basinDischarge: '209.000 m³/s (1/5 de toda a água doce fluvial da Terra)',
    mainRivers: ['Rio Amazonas', 'Rio Solimões', 'Rio Negro', 'Rio Madeira', 'Rio Japurá', 'Rio Purus'],
    hydrologyHighlights: 'Encontro das Águas escuras do Rio Negro e barrentas do Rio Solimões em Manaus sem se misturarem por quilômetros.',
    biome: 'Amazônia (98% de floresta primária intacta)',
    relevo: 'Planície Amazônica e Planalto das Guianas (Pico da Neblina 2.995m - ponto mais alto do Brasil)',
    routes: ['Hidrovia do Rio Amazonas e Solimões (Eixo Intermodal)', 'BR-174 (Manaus - Boa Vista)', 'BR-319'],
    ports: ['Porto Fluvial de Manaus (Polo Industrial da Zona Franca)'],
  },
  BA: {
    stateId: 'BA',
    name: 'Bahia',
    basinName: 'Bacia do São Francisco e Bacias do Atlântico Leste',
    basinDischarge: 'Rio São Francisco corta mais de 1.000 km no interior baiano',
    mainRivers: ['Rio São Francisco', 'Rio Paraguaçu', 'Rio de Contas', 'Rio Grande'],
    hydrologyHighlights: 'Represa e Usina Hidrelétrica de Sobradinho; polo frutícola irrigado em Juazeiro.',
    biome: 'Caatinga (Sertão), Cerrado (Oeste Baiano) e Mata Atlântica (Litoral)',
    relevo: 'Chapada Diamantina (Pico do Barbado 2.033m) e Planaltos do São Francisco',
    routes: ['Rodovia BR-101', 'BR-116 (Rio-Bahia)', 'BR-242 (Eixo Agro Oeste)', 'Ferrovia FIOL'],
    ports: ['Porto de Salvador (Baía de Todos-os-Santos)', 'Porto de Aratu (Químico e Cargas)'],
  },
  CE: {
    stateId: 'CE',
    name: 'Ceará',
    basinName: 'Bacia do Atlântico Nordeste Oriental',
    basinDischarge: 'Regime fluvial intermitente com transposição do São Francisco',
    mainRivers: ['Rio Jaguaribe', 'Rio Acaraú', 'Rio Curu'],
    hydrologyHighlights: 'Rio Jaguaribe é o maior rio seco temporário do mundo; açudes Castanhão e Orós.',
    biome: 'Caatinga (Mosaico de Caatinga Arbustiva e Serras Úmidas)',
    relevo: 'Depressão Sertaneja Cearense e Serras Residuais (Ibiapaba, Baturité e Chapada do Araripe)',
    routes: ['Rodovia BR-116', 'BR-222', 'Ferrovia Transnordestina'],
    ports: ['Porto do Pecém (Hub Internacional Offshore)', 'Porto do Mucuripe (Fortaleza)'],
  },
  DF: {
    stateId: 'DF',
    name: 'Distrito Federal',
    basinName: 'Berço das Águas Triplo: Bacias do Tocantins, São Francisco e Paraná',
    basinDischarge: 'Divisor de águas continental no Planalto Central',
    mainRivers: ['Rio Paranoá (Lago Paranoá)', 'Rio São Bartolomeu', 'Rio Descoberto', 'Rio Preto'],
    hydrologyHighlights: 'Nascentes do DF vertem simultaneamente para as 3 maiores bacias hidrográficas da América do Sul.',
    biome: 'Cerrado Sentido Restrito (Savana)',
    relevo: 'Planalto Central Brasileiro (altitudes entre 1.000m e 1.250m)',
    routes: ['BR-040', 'BR-060', 'BR-020', 'Anel Rodoviário do DF'],
    ports: ['Porto Seco de Brasília (Logística Multimodal)'],
  },
  ES: {
    stateId: 'ES',
    name: 'Espírito Santo',
    basinName: 'Bacia do Rio Doce e Bacias do Atlântico Leste',
    basinDischarge: '900 m³/s no Rio Doce',
    mainRivers: ['Rio Doce', 'Rio Santa Maria da Vitória', 'Rio Jucu', 'Rio Itapemirim'],
    hydrologyHighlights: 'Desembocadura do Rio Doce em Regência; aquíferos costeiros e lagunas de Linhares.',
    biome: 'Mata Atlântica (Florestas de Encosta e Tabuleiros)',
    relevo: 'Serra do Caparaó (Pico da Bandeira 2.892m) e Planície Litorânea',
    routes: ['Rodovia BR-101', 'BR-262', 'Estrada de Ferro Vitória a Minas (EFVM)'],
    ports: ['Porto de Tubarão (Maior porto mineraleiro do mundo)', 'Porto de Vitória'],
  },
  GO: {
    stateId: 'GO',
    name: 'Goiás',
    basinName: 'Bacia Tocantins-Araguaia e Bacia do Rio Paraná',
    basinDischarge: 'Nascentes de alto volume hidrelétrico (UHE Serra da Mesa)',
    mainRivers: ['Rio Araguaia', 'Rio Tocantins', 'Rio Paranaíba', 'Rio Claro'],
    hydrologyHighlights: 'Rio Araguaia abriga a Ilha do Bananal; águas termais de Caldas Novas e Rio Quente.',
    biome: 'Cerrado (Campos Limpos, Cerradão e Veredas)',
    relevo: 'Planalto Central Brasileiro e Chapada dos Veadeiros',
    routes: ['Rodovia BR-153 (Belém-Brasília)', 'BR-060', 'Ferrovia Norte-Sul'],
    ports: ['Porto Seco de Anápolis (Hub Logístico Centro-Oeste)'],
  },
  MA: {
    stateId: 'MA',
    name: 'Maranhão',
    basinName: 'Bacia Tocantins-Araguaia, Bacia do Parnaíba e Bacias Costeiras',
    basinDischarge: 'Transição hídrica entre a Amazônia e o Semiárido',
    mainRivers: ['Rio Parnaíba', 'Rio Itapecuru', 'Rio Mearim', 'Rio Tocantins (Estreito)'],
    hydrologyHighlights: 'Pororoca no Rio Mearim; Lençóis Maranhenses com lagoas pluviais cristalinas em dunas.',
    biome: 'Cerrado, Amazônia e Caatinga (Mata dos Cocais - Babaçu)',
    relevo: 'Planície Costeira das Reentrâncias Maranhenses e Chapadas ao Sul',
    routes: ['Rodovia BR-135', 'BR-222', 'Estrada de Ferro Carajás (EFC)'],
    ports: ['Porto do Itaqui (São Luís - Calado Profundo para Minério e Grãos)'],
  },
  MT: {
    stateId: 'MT',
    name: 'Mato Grosso',
    basinName: 'Bacia Amazônica (Norte) e Bacia do Rio Paraguai / Platina (Sul)',
    basinDischarge: 'Divisor de águas das cabeceiras do Xingu, Tapajós e Paraguai',
    mainRivers: ['Rio Teles Pires', 'Rio Juruena (Tapajós)', 'Rio Xingu', 'Rio Cuiabá', 'Rio Paraguai'],
    hydrologyHighlights: 'Berço do Parque Indígena do Xingu e das águas formadoras do Pantanal mato-grossense.',
    biome: 'Cerrado, Amazônia e Pantanal (Único estado com 3 grandes biomas)',
    relevo: 'Planalto dos Parecis, Chapada dos Guimarães e Planície Pantaneira',
    routes: ['Rodovia BR-163 (Corredor dos Grãos)', 'BR-364', 'Ferrovia Senador Vicente Vuolo'],
    ports: ['Porto Fluvial de Cáceres (Hidrovia Paraguai-Paraná)'],
  },
  MS: {
    stateId: 'MS',
    name: 'Mato Grosso do Sul',
    basinName: 'Bacia do Rio Paraguai (Pantanal) e Bacia do Rio Paraná',
    basinDischarge: 'Ciclo anual de cheias e vazantes pantaneiras',
    mainRivers: ['Rio Paraguai', 'Rio Paraná', 'Rio Miranda', 'Rio Taquari', 'Rio Aquidauana'],
    hydrologyHighlights: 'Maior planície alagável do mundo (Pantanal); rios de águas ultra-transparentes em Bonito.',
    biome: 'Pantanal e Cerrado',
    relevo: 'Planalto de Maracaju e Planície do Pantanal Sul-Mato-Grossense',
    routes: ['Rodovia BR-163', 'BR-262 (Corredor Bioceânico)', 'Ferronorte'],
    ports: ['Porto Fluvial de Corumbá e Ladário (Hidrovia Paraguai-Paraná)'],
  },
  MG: {
    stateId: 'MG',
    name: 'Minas Gerais',
    basinName: 'Bacia do São Francisco ("Caixa d\'Água do Brasil"), Bacia do Paraná e Rio Doce',
    basinDischarge: 'Nascentes fundamentais para o Sudeste, Nordeste e Centro-Oeste',
    mainRivers: ['Rio São Francisco (Nascente na Serra da Canastra)', 'Rio Grande', 'Rio das Velhas', 'Rio Doce', 'Rio Paranaíba'],
    hydrologyHighlights: 'Serra da Canastra dá origem ao Velho Chico; Represa de Furnas (o "Mar de Minas").',
    biome: 'Cerrado, Mata Atlântica e Caatinga (Norte Mineiro)',
    relevo: 'Serra do Espinhaço, Serra da Mantiqueira e Planaltos Cristalinos',
    routes: ['Rodovia BR-040', 'BR-381 (Fernão Dias)', 'BR-116', 'Estrada Real'],
    ports: ['Porto Seco de Varginha e Betim'],
  },
  PA: {
    stateId: 'PA',
    name: 'Pará',
    basinName: 'Bacia Amazônica e Bacia do Tocantins',
    basinDischarge: 'Desembocadura oceânica monumental e UHE Tucuruí e Belo Monte',
    mainRivers: ['Rio Amazonas', 'Rio Tapajós', 'Rio Xingu', 'Rio Tocantins', 'Rio Trombetas'],
    hydrologyHighlights: 'Volta Grande do Xingu (UHE Belo Monte), UHE Tucuruí no Tocantins e Ilha de Marajó.',
    biome: 'Amazônia (Mata de Terra Firme e Florestas de Várzea)',
    relevo: 'Depressão Marginal Sul-Amazônica e Planície Aluvial do Delta',
    routes: ['Rodovia BR-230 (Transamazônica)', 'BR-163 (Cuiabá-Santarém)', 'BR-010 (Belém-Brasília)'],
    ports: ['Porto de Vila do Conde (Barcarena)', 'Porto de Santarém', 'Porto de Belém'],
  },
  PB: {
    stateId: 'PB',
    name: 'Paraíba',
    basinName: 'Bacia do Atlântico Nordeste Oriental',
    basinDischarge: 'Eixo Leste da Transposição do Rio São Francisco',
    mainRivers: ['Rio Paraíba', 'Rio Piranhas-Açu', 'Rio Mamanguape'],
    hydrologyHighlights: 'Águas do Rio São Francisco chegam ao Rio Paraíba abastecendo o Açude Boqueirão e Campina Grande.',
    biome: 'Caatinga (Cariri e Sertão) e Mata Atlântica (Zona da Mata Costeira)',
    relevo: 'Planalto da Borborema e Depressão Sertaneja (Ponta do Seixas - Extremo Oriental)',
    routes: ['Rodovia Translitorânea BR-101', 'BR-230'],
    ports: ['Porto de Cabedelo (Cargas Gerais e Grãos)'],
  },
  PR: {
    stateId: 'PR',
    name: 'Paraná',
    basinName: 'Bacia do Rio Paraná (Bacia Platina)',
    basinDischarge: '16.000 m³/s no Rio Paraná',
    mainRivers: ['Rio Paraná', 'Rio Iguaçu', 'Rio Paranapanema', 'Rio Ivaí', 'Rio Tibagi'],
    hydrologyHighlights: 'Cataratas do Iguaçu (Maravilha Natural) e UHE Itaipu Binacional (uma das maiores do planeta).',
    biome: 'Mata Atlântica (Floresta com Araucárias) e Cerrado',
    relevo: 'Primeiro, Segundo e Terceiro Planaltos Paranaenses e Serra do Mar',
    routes: ['Rodovia BR-277 (Corredor de Exportação)', 'BR-376', 'BR-116'],
    ports: ['Porto de Paranaguá (Segundo maior porto do Brasil em valor de carga)', 'Porto de Antonina'],
  },
  PE: {
    stateId: 'PE',
    name: 'Pernambuco',
    basinName: 'Bacia do São Francisco e Bacias Costeiras',
    basinDischarge: 'Eixo Norte e Leste da Integração do São Francisco',
    mainRivers: ['Rio São Francisco', 'Rio Capibaribe', 'Rio Ipojuca', 'Rio Pajeú'],
    hydrologyHighlights: 'UHE de Itaparica e Paulo Afonso; polo vinícola e de manga irrigada no Vale do São Francisco (Petrolina).',
    biome: 'Caatinga (Sertão e Agreste) e Mata Atlântica (Zona da Mata)',
    relevo: 'Planalto da Borborema, Chapada do Araripe e Planície Costeira Recifense',
    routes: ['Rodovia BR-101', 'BR-232', 'BR-428', 'Ferrovia Transnordestina'],
    ports: ['Porto de Suape (Polo Naval e de Combustíveis)', 'Porto do Recife'],
  },
  PI: {
    stateId: 'PI',
    name: 'Piauí',
    basinName: 'Bacia do Rio Parnaíba',
    basinDischarge: '2.400 m³/s no Rio Parnaíba',
    mainRivers: ['Rio Parnaíba', 'Rio Poti', 'Rio Gurgueia', 'Rio Canindé'],
    hydrologyHighlights: 'Delta do Parnaíba (único delta em mar aberto das Américas com 5 ramificações fluviais).',
    biome: 'Caatinga e Cerrado (Platôs do MATOPIBA)',
    relevo: 'Bacia Sedimentar do Meio-Norte e Chapadas com sítios arqueológicos da Serra da Capivara',
    routes: ['Rodovia BR-343', 'BR-135', 'BR-230'],
    ports: ['Porto Fluvial de Parnaíba (Delta)', 'Porto de Luís Correia'],
  },
  RJ: {
    stateId: 'RJ',
    name: 'Rio de Janeiro',
    basinName: 'Bacia do Rio Paraíba do Sul e Bacias Costeiras',
    basinDischarge: '1.100 m³/s no Paraíba do Sul',
    mainRivers: ['Rio Paraíba do Sul', 'Rio Guandu', 'Rio Macaé', 'Rio Muriaé'],
    hydrologyHighlights: 'Sistema Guandu abastece a Região Metropolitana; Baía de Guanabara e Baía de Ilha Grande.',
    biome: 'Mata Atlântica (Florestas Ombrófilas de Encosta e Restingas)',
    relevo: 'Serra dos Órgãos (Dedo de Deus 1.692m), Maciço da Tijuca e Planície Fluminense',
    routes: ['Rodovia Presidente Dutra (BR-116)', 'BR-101 (Rio-Santos e Rio-Campos)'],
    ports: ['Porto do Rio de Janeiro', 'Porto de Itaguaí (Exportação de Minério)', 'Porto do Açu (Offshore)'],
  },
  RN: {
    stateId: 'RN',
    name: 'Rio Grande do Norte',
    basinName: 'Bacia do Rio Piranhas-Açu e Bacia Potiguar',
    basinDischarge: 'Regime hídrico semiárido com rios temporários',
    mainRivers: ['Rio Piranhas-Açu', 'Rio Apodi-Mossoró', 'Rio Potengi'],
    hydrologyHighlights: 'Barragem Armando Ribeiro Gonçalves (segundo maior reservatório do Nordeste); estuários salineiros.',
    biome: 'Caatinga e Mata Atlântica Costeira',
    relevo: 'Planalto da Borborema e Tabuleiros Costeiros com Dunas de Genipabu',
    routes: ['Rodovia Translitorânea BR-101', 'BR-304', 'BR-226'],
    ports: ['Porto de Natal', 'Terminal Salineiro de Areia Branca (Porto Ilha de Sal Marinho)'],
  },
  RS: {
    stateId: 'RS',
    name: 'Rio Grande do Sul',
    basinName: 'Bacia do Rio Uruguai e Bacia Hidrográfica do Guaíba / Lagoa dos Patos',
    basinDischarge: '4.500 m³/s no Rio Uruguai',
    mainRivers: ['Rio Uruguai', 'Rio Jacuí', 'Rio Taquari', 'Rio dos Sinos', 'Rio Ibicuí'],
    hydrologyHighlights: 'Lago Guaíba e Lagoa dos Patos (maior laguna do Brasil com 10.000 km² conectada ao oceano em Rio Grande).',
    biome: 'Pampa (Campos Sulinos) e Mata Atlântica (Serra Gaúcha)',
    relevo: 'Coxilhas do Pampa, Planalto Meridional (Cânion do Itaimbezinho) e Planície Costeira',
    routes: ['Rodovia BR-116', 'BR-290 (Ligação Brasil-Argentina-Uruguai)', 'BR-386'],
    ports: ['Porto de Rio Grande (Porto Marítimo de Águas Profundas do Cone Sul)', 'Porto Fluvial de Porto Alegre'],
  },
  RO: {
    stateId: 'RO',
    name: 'Rondônia',
    basinName: 'Bacia Amazônica (Sub-bacia do Rio Madeira)',
    basinDischarge: '31.200 m³/s no Rio Madeira',
    mainRivers: ['Rio Madeira', 'Rio Guaporé', 'Rio Mamoré', 'Rio Ji-Paraná (Machado)'],
    hydrologyHighlights: 'Usinas Hidrelétricas de Santo Antônio e Jirau no Rio Madeira; Hidrovia do Madeira escoa grãos do Centro-Oeste.',
    biome: 'Amazônia (Transição para o Cerrado)',
    relevo: 'Planalto dos Parecis e Depressão do Guaporé-Madeira',
    routes: ['Rodovia BR-364 (Corredor Multimodal)', 'Hidrovia do Madeira'],
    ports: ['Porto Fluvial de Porto Velho (Grãos e Combustíveis)'],
  },
  RR: {
    stateId: 'RR',
    name: 'Roraima',
    basinName: 'Bacia Amazônica (Sub-bacia do Rio Branco)',
    basinDischarge: '5.400 m³/s no Rio Branco',
    mainRivers: ['Rio Branco', 'Rio Mucajaí', 'Rio Uraricoera', 'Rio Catrimani'],
    hydrologyHighlights: 'Rio Branco corta o estado de norte a sul até o Rio Negro; bacia de águas límpidas e praias fluviais sazonais.',
    biome: 'Amazônia e Lavrado (Savana Roraimense)',
    relevo: 'Monte Roraima (2.734m - Tepui milenar na tríplice fronteira) e Serra do Parima',
    routes: ['Rodovia BR-174 (Manaus - Boa Vista - Pacaraima - Venezuela)'],
    ports: ['Porto Fluvial de Boa Vista'],
  },
  SC: {
    stateId: 'SC',
    name: 'Santa Catarina',
    basinName: 'Bacia do Rio Uruguai e Bacias do Atlântico Sul',
    basinDischarge: 'Rios de alta energia e quedas hidrelétricas',
    mainRivers: ['Rio Itajaí-Açu', 'Rio Uruguai', 'Rio Pelotas', 'Rio Tubarão', 'Rio Canoas'],
    hydrologyHighlights: 'Vale do Itajaí com regime de cheias e drenagem oceânica; litoral recortado com baías navegáveis.',
    biome: 'Mata Atlântica (Mata de Araucárias e Florestas de Encosta)',
    relevo: 'Serra Geral (Serra do Rio do Rastro e Morro da Boa Vista 1.827m) e Planalto Serrano',
    routes: ['Rodovia BR-101', 'BR-282 (Ligação Leste-Oeste)', 'BR-470'],
    ports: ['Porto de Itajaí e Navegantes (Complexo Portuário de Contêineres)', 'Porto de São Francisco do Sul', 'Porto de Imbituba'],
  },
  SP: {
    stateId: 'SP',
    name: 'São Paulo',
    basinName: 'Bacia do Rio Paraná (Sub-bacias Tietê, Paranapanema e Grande) e Ribeira de Iguape',
    basinDischarge: 'Complexo hidroelétrico e hidroviário de maior PIB do país',
    mainRivers: ['Rio Tietê', 'Rio Paranapanema', 'Rio Grande', 'Rio Pinheiros', 'Rio Paraíba do Sul'],
    hydrologyHighlights: 'Hidrovia Tietê-Paraná para escoamento de grãos e cana; Rio Tietê nasce a 22 km do mar e corre 1.100 km para o interior.',
    biome: 'Mata Atlântica e Cerrado (Interior Paulista)',
    relevo: 'Planalto Atlântico, Serra do Mar, Serra da Mantiqueira (Pedra da Mina 2.798m) e Depressão Periférica',
    routes: ['Rodovia dos Bandeirantes', 'Anhanguera', 'Castello Branco', 'Régis Bittencourt (BR-116)', 'Dutra', 'Rodoanel Mário Covas'],
    ports: ['Porto de Santos (Maior complexo portuário da América Latina)', 'Porto de São Sebastião'],
  },
  SE: {
    stateId: 'SE',
    name: 'Sergipe',
    basinName: 'Bacia do São Francisco e Bacias Costeiras',
    basinDischarge: 'Cânion do Xingó com águas verde-esmeralda',
    mainRivers: ['Rio São Francisco (Foz)', 'Rio Sergipe', 'Rio Vaza-Barris', 'Rio Poxim'],
    hydrologyHighlights: 'Cânion do Xingó (quinto maior cânion navegável do mundo); Foz do Velho Chico em Brejo Grande.',
    biome: 'Caatinga (Sertão Sergipano) e Mata Atlântica (Litoral)',
    relevo: 'Tabuleiros Costeiros e Baixo Planalto do Sertão',
    routes: ['Rodovia Translitorânea BR-101', 'BR-235'],
    ports: ['Terminal Marítimo Inácio Barbosa (Porto de Barra dos Coqueiros)'],
  },
  TO: {
    stateId: 'TO',
    name: 'Tocantins',
    basinName: 'Bacia Tocantins-Araguaia',
    basinDischarge: '13.600 m³/s no Rio Tocantins',
    mainRivers: ['Rio Tocantins', 'Rio Araguaia', 'Rio do Sono', 'Rio Palma'],
    hydrologyHighlights: 'UHE Luiz Eduardo Magalhães (Lajeado); Ilha do Bananal (maior ilha fluvial do mundo) e Jalapão com fervedouros.',
    biome: 'Cerrado e transição Amazônica',
    relevo: 'Planalto Central, Chapada das Mangabeiras e Jalapão (Dunas e Chapadões)',
    routes: ['Rodovia Belém-Brasília (BR-153)', 'Ferrovia Norte-Sul'],
    ports: ['Pátio Multimodal da Ferrovia Norte-Sul em Porto Nacional e Colinas'],
  },
};
