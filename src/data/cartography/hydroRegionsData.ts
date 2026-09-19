/**
 * As 12 Grandes Regiões Hidrográficas do Brasil (ANA - Agência Nacional de Águas)
 * Coordenadas calibradas para o mapa D3 Mercator 2560x1440.
 */

import { ORGANIC_HYDRO_BOUNDARIES, HYDRO_BADGE_POSITIONS } from '../../lib/cartography/precisionTerritoryEngine';

export interface HydroRegionInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  fillColor: string;
  areaKm2: number;
  areaPercentageBr: number;
  dischargeM3s: number;
  populationServed: string;
  mainRivers: string[];
  keyHydroPlants: string[];
  labelPos: { x: number; y: number };
  boundaryPath: string;
}

const RAW_BRAZIL_HYDRO_REGIONS: HydroRegionInfo[] = [
  {
    id: 'amazonica',
    name: 'Região Hidrográfica Amazônica',
    shortName: 'Amazônica',
    color: '#38bdf8', // Ciano luminoso vibrante (como na Imagem 1 e 2)
    fillColor: '#0369a1',
    areaKm2: 3870000,
    areaPercentageBr: 45.3,
    dischargeM3s: 132000,
    populationServed: '10.5 milhões de habitantes',
    mainRivers: ['Rio Amazonas', 'Rio Solimões', 'Rio Negro', 'Rio Madeira', 'Rio Tapajós', 'Rio Xingu', 'Rio Purus', 'Rio Juruá'],
    keyHydroPlants: ['UHE Belo Monte (11.233 MW)', 'UHE Santo Antônio (3.568 MW)', 'UHE Jirau (3.750 MW)', 'UHE Balbina'],
    labelPos: { x: 920, y: 390 },
    boundaryPath: 'M 540,430 C 620,320 780,210 980,210 C 1140,210 1260,260 1340,320 C 1320,440 1280,480 1230,510 C 1170,590 1060,650 940,650 C 780,650 630,590 540,430 Z',
  },
  {
    id: 'tocantins_araguaia',
    name: 'Região Hidrográfica Tocantins-Araguaia',
    shortName: 'Tocantins-Araguaia',
    color: '#eab308', // Amarelo Dourado Vivo (Imagem 1)
    fillColor: '#854d0e',
    areaKm2: 921000,
    areaPercentageBr: 10.8,
    dischargeM3s: 13600,
    populationServed: '9.2 milhões de habitantes',
    mainRivers: ['Rio Tocantins', 'Rio Araguaia', 'Rio das Mortes', 'Rio Vermelho', 'Rio Maranhão', 'Rio Itacaiúnas'],
    keyHydroPlants: ['UHE Tucuruí (8.370 MW)', 'UHE Serra da Mesa (1.275 MW)', 'UHE Peixe Angical', 'UHE Estreito'],
    labelPos: { x: 1285, y: 550 },
    boundaryPath: 'M 1250,330 C 1310,340 1360,400 1350,510 C 1340,620 1320,730 1280,750 C 1230,730 1200,640 1220,530 C 1220,430 1230,360 1250,330 Z',
  },
  {
    id: 'sao_francisco',
    name: 'Região Hidrográfica do São Francisco',
    shortName: 'São Francisco',
    color: '#22c55e', // Verde Floresta Vibrante (Imagem 1)
    fillColor: '#15803d',
    areaKm2: 638000,
    areaPercentageBr: 7.5,
    dischargeM3s: 2850,
    populationServed: '14.3 milhões de habitantes (O Rio da Integração Nacional)',
    mainRivers: ['Rio São Francisco', 'Rio das Velhas', 'Rio Paracatu', 'Rio Grande', 'Rio Urucuia', 'Rio Abaeté'],
    keyHydroPlants: ['UHE Xingó (3.162 MW)', 'UHE Paulo Afonso IV (2.462 MW)', 'UHE Sobradinho (1.050 MW)', 'UHE Itaparica', 'UHE Três Marias'],
    labelPos: { x: 1475, y: 640 },
    boundaryPath: 'M 1370,820 C 1390,750 1420,680 1460,610 C 1510,540 1580,530 1630,570 C 1590,640 1540,730 1470,810 C 1420,840 1380,840 1370,820 Z',
  },
  {
    id: 'parana',
    name: 'Região Hidrográfica do Paraná',
    shortName: 'Paraná',
    color: '#ec4899', // Rosa / Magenta Vivo (Imagem 1)
    fillColor: '#9d174d',
    areaKm2: 879860,
    areaPercentageBr: 10.3,
    dischargeM3s: 11400,
    populationServed: '65 milhões de habitantes (Maior complexo industrial e agrícola)',
    mainRivers: ['Rio Paraná', 'Rio Paranaíba', 'Rio Grande', 'Rio Tietê', 'Rio Paranapanema', 'Rio Iguaçu'],
    keyHydroPlants: ['UHE Itaipu Binacional (14.000 MW)', 'UHE Ilha Solteira (3.444 MW)', 'UHE Furnas (1.216 MW)', 'UHE Porto Primavera'],
    labelPos: { x: 1240, y: 880 },
    boundaryPath: 'M 1240,760 C 1360,760 1420,830 1380,920 C 1320,960 1250,980 1190,990 C 1160,950 1180,850 1200,800 C 1220,770 1230,760 1240,760 Z',
  },
  {
    id: 'paraguai',
    name: 'Região Hidrográfica do Paraguai',
    shortName: 'Paraguai (Pantanal)',
    color: '#06b6d4', // Turquesa Pantanal
    fillColor: '#0e7490',
    areaKm2: 363445,
    areaPercentageBr: 4.3,
    dischargeM3s: 2370,
    populationServed: '2.5 milhões de habitantes (Bacia Sedimentar do Pantanal)',
    mainRivers: ['Rio Paraguai', 'Rio Cuiabá', 'Rio São Lourenço', 'Rio Taquari', 'Rio Miranda', 'Rio Aquidauana'],
    keyHydroPlants: ['UHE Manso (212 MW)', 'PCHs do Planalto'],
    labelPos: { x: 1110, y: 720 },
    boundaryPath: 'M 1090,620 C 1140,640 1160,710 1150,790 C 1120,860 1080,880 1050,840 C 1050,760 1060,680 1090,620 Z',
  },
  {
    id: 'parnaiba',
    name: 'Região Hidrográfica do Parnaíba',
    shortName: 'Parnaíba',
    color: '#f59e0b', // Âmbar Dourado
    fillColor: '#b45309',
    areaKm2: 333056,
    areaPercentageBr: 3.9,
    dischargeM3s: 760,
    populationServed: '4.2 milhões de habitantes (Delta em mar aberto)',
    mainRivers: ['Rio Parnaíba', 'Rio das Balsas', 'Rio Gurgueia', 'Rio Poti', 'Rio Canindé', 'Rio Uruçuí-Preto'],
    keyHydroPlants: ['UHE Boa Esperança (350 MW)'],
    labelPos: { x: 1440, y: 460 },
    boundaryPath: 'M 1390,390 C 1450,380 1480,430 1470,510 C 1450,570 1410,560 1390,520 C 1380,460 1370,410 1390,390 Z',
  },
  {
    id: 'atlantico_nordeste_oriental',
    name: 'Atlântico Nordeste Oriental',
    shortName: 'Atl. NE Oriental',
    color: '#c084fc', // Lilás / Roxo (Imagem 1)
    fillColor: '#7e22ce',
    areaKm2: 287348,
    areaPercentageBr: 3.4,
    dischargeM3s: 780,
    populationServed: '24 milhões de habitantes (Ceará, RN, PB, PE e AL)',
    mainRivers: ['Rio Jaguaribe', 'Rio Piranhas-Açu', 'Rio Capibaribe', 'Rio Beberibe', 'Rio Paraíba'],
    keyHydroPlants: ['Açude Castanhão (6,7 bi m³)', 'Açude Orós', 'Canais da Transposição'],
    labelPos: { x: 1590, y: 460 },
    boundaryPath: 'M 1490,410 C 1580,400 1630,440 1625,510 C 1580,525 1520,500 1490,470 C 1480,440 1485,420 1490,410 Z',
  },
  {
    id: 'atlantico_leste',
    name: 'Atlântico Leste',
    shortName: 'Atlântico Leste',
    color: '#fb923c', // Coral / Terracota (Imagem 1)
    fillColor: '#c2410c',
    areaKm2: 374677,
    areaPercentageBr: 4.4,
    dischargeM3s: 1490,
    populationServed: '16.5 milhões de habitantes (Bahia, Minas e Sergipe)',
    mainRivers: ['Rio Jequitinhonha', 'Rio Paraguaçu', 'Rio Contas', 'Rio Pardo', 'Rio Mucuri', 'Rio Vaza-Barris'],
    keyHydroPlants: ['UHE Pedra do Cavalo (160 MW)', 'UHE Irapé (360 MW)'],
    labelPos: { x: 1540, y: 690 },
    boundaryPath: 'M 1480,630 C 1540,620 1590,660 1570,750 C 1540,780 1490,760 1470,720 C 1460,680 1470,640 1480,630 Z',
  },
  {
    id: 'atlantico_sudeste',
    name: 'Atlântico Sudeste',
    shortName: 'Atlântico Sudeste',
    color: '#f97316', // Laranja Intenso
    fillColor: '#ea580c',
    areaKm2: 229972,
    areaPercentageBr: 2.7,
    dischargeM3s: 3180,
    populationServed: '32 milhões de habitantes (RJ, ES, SP e MG)',
    mainRivers: ['Rio Doce', 'Rio Paraíba do Sul', 'Rio Ribeira de Iguape', 'Rio Guandu', 'Rio Itabapoana'],
    keyHydroPlants: ['UHE Aimorés (330 MW)', 'UHE Simplício (219 MW)', 'Complexo Guandu CEDAE'],
    labelPos: { x: 1480, y: 840 },
    boundaryPath: 'M 1440,790 C 1510,790 1540,830 1520,890 C 1480,910 1430,890 1410,850 C 1410,820 1420,800 1440,790 Z',
  },
  {
    id: 'uruguai',
    name: 'Região Hidrográfica do Uruguai',
    shortName: 'Uruguai',
    color: '#38bdf8', // Turquesa Sul (Imagem 1)
    fillColor: '#0284c7',
    areaKm2: 174612,
    areaPercentageBr: 2.0,
    dischargeM3s: 4100,
    populationServed: '4.2 milhões de habitantes (RS e SC)',
    mainRivers: ['Rio Uruguai', 'Rio Pelotas', 'Rio Canoas', 'Rio Passo Fundo', 'Rio Chapecó', 'Rio Ijuí'],
    keyHydroPlants: ['UHE Itá (1.450 MW)', 'UHE Machadinho (1.140 MW)', 'UHE Campos Novos (880 MW)', 'UHE Foz do Chapecó'],
    labelPos: { x: 1190, y: 1040 },
    boundaryPath: 'M 1150,1000 C 1230,990 1280,1020 1270,1060 C 1220,1080 1170,1070 1130,1050 C 1130,1020 1140,1010 1150,1000 Z',
  },
  {
    id: 'atlantico_sul',
    name: 'Atlântico Sul',
    shortName: 'Atlântico Sul',
    color: '#e11d48', // Vermelho Rubi / Rosa Sul
    fillColor: '#9f1239',
    areaKm2: 185856,
    areaPercentageBr: 2.2,
    dischargeM3s: 4300,
    populationServed: '14 milhões de habitantes (PR, SC e RS)',
    mainRivers: ['Rio Itajaí-Açu', 'Rio Jacuí', 'Rio Taquari', 'Rio dos Sinos', 'Rio Gravataí', 'Lago Guaíba', 'Lagoa dos Patos'],
    keyHydroPlants: ['UHE Passo Real (158 MW)', 'UHE Dona Francisca (125 MW)'],
    labelPos: { x: 1220, y: 1110 },
    boundaryPath: 'M 1210,1050 C 1270,1050 1280,1110 1250,1170 C 1200,1180 1160,1150 1170,1090 C 1180,1060 1200,1050 1210,1050 Z',
  },
  {
    id: 'atlantico_nordeste_ocidental',
    name: 'Atlântico Nordeste Ocidental',
    shortName: 'Atl. NE Ocidental',
    color: '#a855f7', // Púrpura Maranhense
    fillColor: '#6b21a8',
    areaKm2: 254100,
    areaPercentageBr: 3.0,
    dischargeM3s: 2680,
    populationServed: '5.8 milhões de habitantes (Maranhão e Pará)',
    mainRivers: ['Rio Itapecuru', 'Rio Mearim', 'Rio Grajaú', 'Rio Pindaré', 'Rio Munim', 'Rio Gurupi'],
    keyHydroPlants: ['Porto do Itaqui', 'Baía de São Marcos'],
    labelPos: { x: 1360, y: 390 },
    boundaryPath: 'M 1320,330 C 1370,330 1400,370 1390,430 C 1360,450 1320,430 1310,380 C 1310,350 1315,340 1320,330 Z',
  },
];

export const BRAZIL_HYDRO_REGIONS: HydroRegionInfo[] = RAW_BRAZIL_HYDRO_REGIONS.map((region) => ({
  ...region,
  boundaryPath: ORGANIC_HYDRO_BOUNDARIES[region.id] || region.boundaryPath || '',
  labelPos: HYDRO_BADGE_POSITIONS[region.id]
    ? { x: HYDRO_BADGE_POSITIONS[region.id].x, y: HYDRO_BADGE_POSITIONS[region.id].y }
    : region.labelPos || { x: 1000, y: 700 },
}));

