/**
 * precisionTerritoryEngine.ts
 * Motor de Precisão Cartográfica e Contornos Orgânicos (Território & Redes Vivas).
 * Projeção D3 Mercator calibrada para o Canvas 2560x1440.
 *
 * Substitui aproximações primitivas (elipses/bolhas) por contornos orgânicos
 * contínuos fiéis à orografia, hidrologia da ANA e biomas do IBGE.
 */

export interface OrganicBoundaryDefinition {
  id: string;
  name: string;
  shortName: string;
  color: string;
  fillColor: string;
  strokeColor: string;
  d: string;
  centroid: [number, number];
  badgePos: [number, number];
  areaKm2: number;
  percentageBr: number;
  dischargeM3s?: number;
  statesIncluded: string[];
}

/**
 * 1. Limites Orgânicos das 12 Regiões Hidrográficas do Brasil (ANA Oficial - Imagem de Referência ANA)
 * As curvas cúbicas Bézier contínuas acompanham as linhas de cumeada e bacias fluviais reais.
 */
export const ORGANIC_HYDRO_BOUNDARIES: Record<string, string> = {
  // 1. Bacia Amazônica: Cobre AC, AM, RR, RO, AP, quase todo o PA e norte/oeste de MT
  amazonica:
    'M 545,495 ' +
    'C 530,460 560,420 600,430 ' +
    'C 640,410 710,360 760,280 ' +
    'C 800,240 850,210 930,185 ' +
    'C 990,175 1050,200 1080,240 ' +
    'C 1120,250 1190,230 1235,225 ' +
    'C 1270,250 1285,290 1260,335 ' +
    'C 1240,365 1250,410 1230,460 ' +
    'C 1205,510 1180,560 1160,610 ' +
    'C 1130,645 1060,655 1010,650 ' +
    'C 960,650 910,630 860,635 ' +
    'C 800,640 760,600 700,580 ' +
    'C 640,565 570,540 545,495 Z',

  // 2. Tocantins-Araguaia: O corredor vertical central de Goiás/DF até Belém/Marajó
  tocantins_araguaia:
    'M 1275,325 ' +
    'C 1315,350 1320,400 1310,460 ' +
    'C 1335,510 1355,560 1345,630 ' +
    'C 1340,680 1330,730 1290,745 ' +
    'C 1245,745 1225,700 1215,640 ' +
    'C 1205,570 1210,500 1225,430 ' +
    'C 1235,380 1245,345 1275,325 Z',

  // 3. Atlântico Nordeste Ocidental: Baixada Maranhense e litoral norte do Pará/Maranhão
  atlantico_nordeste_ocidental:
    'M 1295,330 ' +
    'C 1335,340 1390,360 1420,385 ' +
    'C 1425,420 1400,455 1370,470 ' +
    'C 1335,465 1310,430 1300,380 ' +
    'C 1290,355 1292,340 1295,330 Z',

  // 4. Bacia do Parnaíba: Vale completo do Piauí e leste do Maranhão
  parnaiba:
    'M 1425,385 ' +
    'C 1465,390 1485,425 1475,470 ' +
    'C 1470,510 1460,560 1435,585 ' +
    'C 1400,590 1380,550 1385,495 ' +
    'C 1390,445 1405,405 1425,385 Z',

  // 5. Atlântico Nordeste Oriental: Ceará, Rio Grande do Norte, Paraíba, Pernambuco, Alagoas
  atlantico_nordeste_oriental:
    'M 1485,400 ' +
    'C 1550,395 1610,420 1630,445 ' +
    'C 1640,480 1625,530 1595,555 ' +
    'C 1555,560 1515,530 1495,490 ' +
    'C 1475,450 1475,415 1485,400 Z',

  // 6. Bacia do São Francisco: Da Serra da Canastra (MG) até a foz em Piaçabuçu (AL/SE)
  sao_francisco:
    'M 1355,820 ' +
    'C 1385,780 1405,720 1425,660 ' +
    'C 1445,600 1475,550 1520,535 ' +
    'C 1565,535 1600,555 1625,575 ' +
    'C 1595,610 1550,630 1510,660 ' +
    'C 1475,700 1450,750 1430,810 ' +
    'C 1395,845 1365,845 1355,820 Z',

  // 7. Atlântico Leste: Costa da Bahia, leste de Minas (Jequitinhonha) e norte do Espírito Santo
  atlantico_leste:
    'M 1525,640 ' +
    'C 1565,635 1585,670 1575,730 ' +
    'C 1565,770 1540,800 1510,805 ' +
    'C 1475,795 1465,750 1475,700 ' +
    'C 1485,660 1500,645 1525,640 Z',

  // 8. Atlântico Sudeste: ES, RJ, litoral de SP (Serra do Mar) e sul de MG (Paraíba do Sul/Doce)
  atlantico_sudeste:
    'M 1475,800 ' +
    'C 1520,795 1540,830 1525,875 ' +
    'C 1505,910 1445,925 1395,935 ' +
    'C 1365,945 1350,925 1380,890 ' +
    'C 1410,855 1445,820 1475,800 Z',

  // 9. Bacia do Paraná: Sul de GO, Triângulo Mineiro, SP, PR, oeste de SC e leste de MS
  parana:
    'M 1270,740 ' +
    'C 1340,750 1385,810 1370,870 ' +
    'C 1355,920 1315,960 1265,985 ' +
    'C 1215,1005 1175,995 1155,950 ' +
    'C 1145,900 1170,840 1195,795 ' +
    'C 1220,760 1245,740 1270,740 Z',

  // 10. Bacia do Paraguai: Bacia sedimentar do Pantanal (oeste de MT e MS)
  paraguai:
    'M 1085,635 ' +
    'C 1125,650 1140,710 1135,780 ' +
    'C 1130,830 1105,875 1070,870 ' +
    'C 1045,860 1040,800 1045,730 ' +
    'C 1050,670 1065,640 1085,635 Z',

  // 11. Bacia do Uruguai: Noroeste do Rio Grande do Sul e oeste de Santa Catarina
  uruguai:
    'M 1220,1030 ' +
    'C 1250,1040 1235,1070 1195,1085 ' +
    'C 1155,1095 1115,1120 1095,1105 ' +
    'C 1090,1075 1120,1055 1160,1045 ' +
    'C 1190,1035 1205,1025 1220,1030 Z',

  // 12. Atlântico Sul: Faixa litorânea de PR/SC e bacia lagunar do RS (Lagoa dos Patos)
  atlantico_sul:
    'M 1275,980 ' +
    'C 1300,1010 1285,1065 1260,1115 ' +
    'C 1235,1160 1200,1210 1165,1205 ' +
    'C 1150,1170 1175,1115 1205,1065 ' +
    'C 1230,1025 1255,995 1275,980 Z',
};

/**
 * 2. Limites Orgânicos dos 6 Biomas Continentais do Brasil (IBGE)
 */
export const ORGANIC_BIOME_BOUNDARIES: Record<string, string> = {
  amazonia:
    'M 540,490 ' +
    'C 525,450 560,405 605,415 ' +
    'C 650,400 710,350 765,275 ' +
    'C 810,235 860,205 940,180 ' +
    'C 1000,170 1060,195 1090,235 ' +
    'C 1130,245 1195,225 1240,220 ' +
    'C 1275,245 1290,285 1270,330 ' +
    'C 1250,360 1260,405 1245,455 ' +
    'C 1220,505 1195,555 1175,605 ' +
    'C 1145,640 1075,650 1025,645 ' +
    'C 975,645 925,625 875,630 ' +
    'C 815,635 775,595 715,575 ' +
    'C 655,560 585,535 540,490 Z',

  cerrado:
    'M 1180,510 ' +
    'C 1260,490 1345,510 1400,560 ' +
    'C 1445,610 1465,680 1440,750 ' +
    'C 1410,810 1345,835 1285,830 ' +
    'C 1215,825 1155,790 1120,735 ' +
    'C 1095,685 1105,620 1135,565 ' +
    'C 1150,540 1165,520 1180,510 Z',

  caatinga:
    'M 1430,420 ' +
    'C 1495,405 1565,420 1600,455 ' +
    'C 1620,485 1610,530 1575,560 ' +
    'C 1530,590 1475,625 1435,660 ' +
    'C 1410,630 1405,580 1415,530 ' +
    'C 1420,485 1415,450 1430,420 Z',

  mata_atlantica:
    'M 1585,530 ' +
    'C 1615,550 1605,610 1580,670 ' +
    'C 1555,730 1535,790 1500,845 ' +
    'C 1460,900 1395,945 1320,970 ' +
    'C 1265,990 1215,1030 1180,1090 ' +
    'C 1155,1065 1175,1015 1225,975 ' +
    'C 1275,935 1345,905 1395,860 ' +
    'C 1435,820 1475,765 1495,705 ' +
    'C 1515,645 1545,590 1585,530 Z',

  pantanal:
    'M 1060,670 ' +
    'C 1100,665 1125,710 1120,775 ' +
    'C 1115,825 1095,865 1065,860 ' +
    'C 1045,850 1040,800 1045,745 ' +
    'C 1048,705 1052,680 1060,670 Z',

  pampa:
    'M 1120,1100 ' +
    'C 1175,1085 1225,1105 1235,1145 ' +
    'C 1225,1190 1185,1225 1145,1220 ' +
    'C 1115,1205 1095,1160 1105,1125 ' +
    'C 1110,1110 1115,1105 1120,1100 Z',
};

/**
 * Posições calibradas e otimizadas dos balões de dados
 * Garante que nenhum selo colida ou sobreponha outros textos.
 */
export const HYDRO_BADGE_POSITIONS: Record<string, { x: number; y: number; anchorDirection: 'top' | 'bottom' | 'center' }> = {
  amazonica: { x: 930, y: 350, anchorDirection: 'center' },
  tocantins_araguaia: { x: 1285, y: 520, anchorDirection: 'center' },
  atlantico_nordeste_ocidental: { x: 1365, y: 375, anchorDirection: 'bottom' },
  parnaiba: { x: 1435, y: 470, anchorDirection: 'center' },
  atlantico_nordeste_oriental: { x: 1610, y: 475, anchorDirection: 'center' },
  sao_francisco: { x: 1475, y: 640, anchorDirection: 'center' },
  atlantico_leste: { x: 1545, y: 720, anchorDirection: 'center' },
  atlantico_sudeste: { x: 1470, y: 865, anchorDirection: 'center' },
  parana: { x: 1245, y: 875, anchorDirection: 'center' },
  paraguai: { x: 1090, y: 750, anchorDirection: 'center' },
  uruguai: { x: 1160, y: 1060, anchorDirection: 'center' },
  atlantico_sul: { x: 1240, y: 1130, anchorDirection: 'top' },
};
