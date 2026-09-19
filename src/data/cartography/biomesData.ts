/**
 * Dados Cartográficos Oficiais dos 6 Biomas do Brasil (IBGE)
 * Projeção e limites calibrados para o Canvas 2560x1440.
 */

import { ORGANIC_BIOME_BOUNDARIES } from '../../lib/cartography/precisionTerritoryEngine';

export interface BiomeGeoFeature {
  id: string;
  name: string;
  shortName: string;
  color: string;
  fillColor: string;
  areaKm2: number;
  percentageBr: number;
  vegetationType: string;
  floraHighlights: string[];
  faunaHighlights: string[];
  threatStatus: string;
  centerPos: { x: number; y: number };
  boundaryPath: string;
}

const RAW_BRAZIL_OFFICIAL_BIOMES: BiomeGeoFeature[] = [
  {
    id: 'amazonia',
    name: 'Bioma Amazônia',
    shortName: 'Amazônia',
    color: '#10b981', // Verde Esmeralda Vibrante
    fillColor: '#064e3b',
    areaKm2: 4196943,
    percentageBr: 49.3,
    vegetationType: 'Floresta Pluvial Tropical Úmida de Terra Firme, Várzea e Igapó',
    floraHighlights: ['Castanheira-do-Pará', 'Samaúma', 'Vitória-régia', 'Açaizeiro'],
    faunaHighlights: ['Onça-pintada', 'Arara-azul-grande', 'Boto-cor-de-rosa', 'Gavião-real (Harpia)'],
    threatStatus: '17% de desmatamento histórico acumulado; pressão agropecuária na fronteira sul',
    centerPos: { x: 920, y: 390 },
    boundaryPath: 'M 540,430 C 620,320 780,210 980,210 C 1140,210 1260,260 1340,320 C 1315,440 1280,480 1210,510 C 1140,580 1020,630 890,630 C 760,630 630,590 540,430 Z',
  },
  {
    id: 'cerrado',
    name: 'Bioma Cerrado',
    shortName: 'Cerrado',
    color: '#f59e0b', // Dourado Savânico
    fillColor: '#78350f',
    areaKm2: 2036448,
    percentageBr: 23.9,
    vegetationType: 'Savana Tropical, Campos Limpos, Cerradão e Matas de Galeria (Berço das Águas)',
    floraHighlights: ['Pequizeiro', 'Buriti', 'Ipê-amarelo', 'Baru'],
    faunaHighlights: ['Lobo-guará', 'Tamanduá-bandeira', 'Tatu-canastra', 'Anta'],
    threatStatus: 'Hotspot global de biodiversidade; abriga as nascentes das 3 maiores bacias',
    centerPos: { x: 1280, y: 680 },
    boundaryPath: 'M 1090,600 C 1240,510 1360,540 1440,640 C 1460,740 1410,830 1320,830 C 1220,830 1140,780 1090,690 C 1070,640 1080,610 1090,600 Z',
  },
  {
    id: 'mata_atlantica',
    name: 'Bioma Mata Atlântica',
    shortName: 'Mata Atlântica',
    color: '#22c55e', // Verde Florestal Costeiro
    fillColor: '#14532d',
    areaKm2: 1110182,
    percentageBr: 13.0,
    vegetationType: 'Floresta Ombrófila Densa, Floresta Estacional e Manguezais Litorâneos',
    floraHighlights: ['Pau-brasil', 'Palmito-juçara', 'Araucária (Pinho-do-paraná)', 'Bromélias epífitas'],
    faunaHighlights: ['Mico-leão-dourado', 'Muriqui-do-sul', 'Tucano-de-bico-preto', 'Onça-parda'],
    threatStatus: 'Apenas ~12% de cobertura original remanescente; abriga 72% da população brasileira',
    centerPos: { x: 1470, y: 840 },
    boundaryPath: 'M 1390,830 C 1460,780 1520,770 1560,720 C 1580,660 1620,530 1625,510 C 1570,680 1530,830 1470,910 C 1370,970 1280,1030 1250,1110 C 1220,1130 1210,1070 1240,990 C 1300,940 1350,890 1390,830 Z',
  },
  {
    id: 'caatinga',
    name: 'Bioma Caatinga',
    shortName: 'Caatinga',
    color: '#f43f5e', // Rosa Sertanejo Vivo
    fillColor: '#831843',
    areaKm2: 844453,
    percentageBr: 9.9,
    vegetationType: 'Estepe Savânica Semiárida com Vegetação Caducifólia e Espinhosa (100% Endêmica)',
    floraHighlights: ['Mandacaru', 'Xique-xique', 'Juazeiro', 'Umbuzeiro'],
    faunaHighlights: ['Ararinha-azul', 'Asa-branca', 'Tatu-bola', 'Gato-do-mato-pintado'],
    threatStatus: 'Único bioma com limites exclusivamente brasileiros; vulnerável à desertificação',
    centerPos: { x: 1540, y: 510 },
    boundaryPath: 'M 1430,460 C 1500,410 1590,420 1620,470 C 1625,540 1570,580 1500,640 C 1450,670 1420,620 1420,540 C 1420,490 1425,470 1430,460 Z',
  },
  {
    id: 'pantanal',
    name: 'Bioma Pantanal',
    shortName: 'Pantanal',
    color: '#06b6d4', // Turquesa Alagado
    fillColor: '#0e7490',
    areaKm2: 150355,
    percentageBr: 1.8,
    vegetationType: 'Maior Planície de Inundação Contínua do Planeta Terra (Mosaico Hidrológico)',
    floraHighlights: ['Aguapé', 'Carandá', 'Camalote', 'Piúva (Ipê-roxo)'],
    faunaHighlights: ['Maior densidade de Onças-pintadas', 'Tuiuiú (Ave-símbolo)', 'Jacaré-do-pantanal', 'Capivara'],
    threatStatus: 'Ciclos de seca extrema e incêndios sazonais no maciço pantaneiro',
    centerPos: { x: 1100, y: 760 },
    boundaryPath: 'M 1090,640 C 1130,660 1150,720 1140,800 C 1110,850 1070,860 1050,810 C 1050,740 1060,680 1090,640 Z',
  },
  {
    id: 'pampa',
    name: 'Bioma Pampa',
    shortName: 'Pampa',
    color: '#a855f7', // Púrpura dos Pampas
    fillColor: '#4c1d95',
    areaKm2: 176496,
    percentageBr: 2.1,
    vegetationType: 'Campos Sulinos, Coxilhas e Matas de Galeria com Vegetação Herbácea Rasteira',
    floraHighlights: ['Capim-forquilha', 'Trevo-nativo', 'Babosa-do-campo', 'Algarrobo'],
    faunaHighlights: ['Veado-campeiro', 'Quero-quero (Ave-símbolo)', 'Gato-palheiro', 'Perdiz'],
    threatStatus: 'Avanço de monoculturas de soja e silvicultura de eucalipto sobre os campos nativos',
    centerPos: { x: 1180, y: 1120 },
    boundaryPath: 'M 1130,1070 C 1200,1060 1240,1100 1230,1160 C 1180,1180 1130,1150 1120,1100 C 1120,1080 1125,1075 1130,1070 Z',
  },
];

export const BRAZIL_OFFICIAL_BIOMES: BiomeGeoFeature[] = RAW_BRAZIL_OFFICIAL_BIOMES.map((biome) => ({
  ...biome,
  boundaryPath: ORGANIC_BIOME_BOUNDARIES[biome.id] || biome.boundaryPath,
}));

