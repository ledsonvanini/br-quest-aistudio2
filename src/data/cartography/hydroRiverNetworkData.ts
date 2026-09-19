/**
 * hydroRiverNetworkData.ts
 * Rede de Rios e Veios Dendríticos de Alta Densidade (Estilo Cartográfico ANA / HidroWeb).
 * Inclui os leitos mestres navegáveis e centenas de afluentes ramificados.
 */

import { HYDRO_RIVER_NETWORK_SOUTH } from './hydroRiverNetworkSouthData';
export { MAJOR_HYDRO_PINS } from './hydroFeaturePinsData';
export type { HydroFeaturePin } from './hydroFeaturePinsData';

export interface RiverVeinBranch {
  id: string;
  regionId: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  d: string;
  name?: string;
  isMainTrunk?: boolean;
}

export type RiverPathSegment = RiverVeinBranch;

const HYDRO_RIVER_NETWORK_NORTH: RiverVeinBranch[] = [
  // =========================================================================
  // 1. BACIA AMAZÔNICA - SISTEMA VASCULAR AZUL CIANO (#38bdf8 / #67e8f9)
  // =========================================================================
  {
    id: 'amz-tronco-principal',
    regionId: 'amazonica',
    color: '#38bdf8',
    strokeWidth: 5.5,
    opacity: 0.95,
    d: 'M 540,430 C 660,420 740,435 830,415 C 880,405 920,410 990,390 C 1080,380 1180,350 1260,310',
    name: 'Rio Solimões / Rio Amazonas',
    isMainTrunk: true,
  },
  {
    id: 'amz-foz-marajo',
    regionId: 'amazonica',
    color: '#67e8f9',
    strokeWidth: 4.2,
    opacity: 0.9,
    d: 'M 1260,310 C 1280,290 1305,270 1325,255 M 1260,310 C 1280,330 1315,350 1335,360',
    name: 'Foz do Amazonas / Baía do Marajó',
  },
  {
    id: 'amz-rio-negro',
    regionId: 'amazonica',
    color: '#38bdf8',
    strokeWidth: 3.8,
    opacity: 0.9,
    d: 'M 820,240 C 850,280 890,330 920,400',
    name: 'Rio Negro (Águas Negras)',
    isMainTrunk: true,
  },
  {
    id: 'amz-rio-branco',
    regionId: 'amazonica',
    color: '#67e8f9',
    strokeWidth: 2.8,
    opacity: 0.85,
    d: 'M 880,180 C 890,220 895,270 885,320',
    name: 'Rio Branco (Roraima)',
  },
  {
    id: 'amz-rio-madeira',
    regionId: 'amazonica',
    color: '#38bdf8',
    strokeWidth: 4.2,
    opacity: 0.95,
    d: 'M 840,650 C 860,570 900,510 960,450 C 975,435 985,410 1000,390',
    name: 'Rio Madeira (Jirau & S. Antônio)',
    isMainTrunk: true,
  },
  {
    id: 'amz-rio-tapajos',
    regionId: 'amazonica',
    color: '#38bdf8',
    strokeWidth: 3.6,
    opacity: 0.9,
    d: 'M 1040,660 C 1050,580 1070,500 1100,430 C 1110,400 1115,380 1120,360',
    name: 'Rio Tapajós (Águas Verdes)',
    isMainTrunk: true,
  },
  {
    id: 'amz-rio-xingu',
    regionId: 'amazonica',
    color: '#38bdf8',
    strokeWidth: 3.8,
    opacity: 0.92,
    d: 'M 1180,680 C 1170,600 1160,520 1180,440 C 1190,400 1205,370 1210,340',
    name: 'Rio Xingu (Belo Monte / Volta Grande)',
    isMainTrunk: true,
  },
  {
    id: 'amz-rio-purus',
    regionId: 'amazonica',
    color: '#67e8f9',
    strokeWidth: 2.8,
    opacity: 0.85,
    d: 'M 640,600 C 690,550 740,500 810,460 C 840,440 860,430 880,420',
    name: 'Rio Purus (Acre ao Solimões)',
  },
  {
    id: 'amz-rio-jurua',
    regionId: 'amazonica',
    color: '#67e8f9',
    strokeWidth: 2.6,
    opacity: 0.85,
    d: 'M 520,530 C 570,490 620,460 670,440 C 700,430 730,425 760,420',
    name: 'Rio Juruá (Rios Meândricos)',
  },
  {
    id: 'amz-dendrites-norte',
    regionId: 'amazonica',
    color: '#bae6fd',
    strokeWidth: 1.4,
    opacity: 0.75,
    d: 'M 800,290 C 820,280 840,290 850,300 M 940,280 C 960,300 970,330 980,350 M 1020,320 C 1050,340 1060,360 1070,370 M 740,380 C 760,370 780,390 800,400 M 1150,290 C 1170,310 1190,320 1200,330',
  },
  {
    id: 'amz-dendrites-sul',
    regionId: 'amazonica',
    color: '#bae6fd',
    strokeWidth: 1.4,
    opacity: 0.75,
    d: 'M 720,560 C 740,540 760,530 770,510 M 820,580 C 840,560 850,540 860,520 M 920,620 C 940,590 950,570 960,550 M 1000,580 C 1020,550 1030,530 1040,500 M 1120,600 C 1140,570 1150,540 1160,510',
  },

  // =========================================================================
  // 2. BACIA DO TOCANTINS-ARAGUAIA - VEIOS AMARELOS OURO (#eab308 / #facc15)
  // =========================================================================
  {
    id: 'toc-rio-araguaia',
    regionId: 'tocantins_araguaia',
    color: '#eab308',
    strokeWidth: 4.2,
    opacity: 0.95,
    d: 'M 1220,740 C 1230,660 1240,580 1260,490 C 1270,440 1280,410 1290,380',
    name: 'Rio Araguaia (Ilha do Bananal)',
    isMainTrunk: true,
  },
  {
    id: 'toc-rio-tocantins',
    regionId: 'tocantins_araguaia',
    color: '#facc15',
    strokeWidth: 4.4,
    opacity: 0.95,
    d: 'M 1310,720 C 1315,640 1310,550 1290,460 C 1285,410 1290,360 1295,310',
    name: 'Rio Tocantins (UHE Tucuruí)',
    isMainTrunk: true,
  },
  {
    id: 'toc-rio-das-mortes',
    regionId: 'tocantins_araguaia',
    color: '#fef08a',
    strokeWidth: 2.2,
    opacity: 0.85,
    d: 'M 1170,680 C 1200,660 1220,630 1235,590',
    name: 'Rio das Mortes',
  },
  {
    id: 'toc-rio-maranhao-paranaiba',
    regionId: 'tocantins_araguaia',
    color: '#fef08a',
    strokeWidth: 2.2,
    opacity: 0.85,
    d: 'M 1320,760 C 1315,730 1310,700 1310,660',
    name: 'Rio Maranhão (Serra da Mesa)',
  },
  {
    id: 'toc-dendrites',
    regionId: 'tocantins_araguaia',
    color: '#fef9c3',
    strokeWidth: 1.4,
    opacity: 0.75,
    d: 'M 1260,650 C 1280,630 1290,610 1300,580 M 1210,560 C 1230,540 1240,510 1250,480 M 1280,450 C 1300,430 1310,400 1320,380',
  },

  // =========================================================================
  // 3. BACIA DO SÃO FRANCISCO - VEIOS VERDES ESMERALDA (#22c55e / #4ade80)
  // =========================================================================
  {
    id: 'sf-tronco-principal',
    regionId: 'sao_francisco',
    color: '#22c55e',
    strokeWidth: 4.8,
    opacity: 0.96,
    d: 'M 1380,820 C 1420,740 1450,660 1480,590 C 1510,540 1560,530 1630,570',
    name: 'Rio São Francisco (O Velho Chico)',
    isMainTrunk: true,
  },
  {
    id: 'sf-rio-das-velhas',
    regionId: 'sao_francisco',
    color: '#4ade80',
    strokeWidth: 2.6,
    opacity: 0.9,
    d: 'M 1420,830 C 1415,790 1410,750 1400,720',
    name: 'Rio das Velhas (MG)',
  },
  {
    id: 'sf-rio-paracatu',
    regionId: 'sao_francisco',
    color: '#86efac',
    strokeWidth: 2.2,
    opacity: 0.85,
    d: 'M 1330,750 C 1360,730 1390,720 1420,700',
    name: 'Rio Paracatu',
  },
  {
    id: 'sf-rio-grande-ba',
    regionId: 'sao_francisco',
    color: '#86efac',
    strokeWidth: 2.4,
    opacity: 0.85,
    d: 'M 1370,620 C 1400,610 1430,600 1460,590',
    name: 'Rio Grande (Barreiras - BA)',
  },
  {
    id: 'sf-dendrites',
    regionId: 'sao_francisco',
    color: '#bbf7d0',
    strokeWidth: 1.4,
    opacity: 0.75,
    d: 'M 1440,770 C 1460,740 1470,720 1480,690 M 1390,670 C 1420,650 1440,640 1460,630 M 1490,580 C 1520,570 1540,560 1570,555',
  },
];

export const HYDRO_RIVER_NETWORK: RiverVeinBranch[] = [
  ...HYDRO_RIVER_NETWORK_NORTH,
  ...HYDRO_RIVER_NETWORK_SOUTH,
];
