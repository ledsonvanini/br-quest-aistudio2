/**
 * hydroRiverNetworkSouthData.ts
 * Redes Dendríticas e Veios Fluviais dos Rios do Centro-Sul, Leste e Nordeste Setentrional.
 * Bacias: Paraná, Paraguai, Parnaíba, Atlântico Leste, Atlântico Sudeste, Uruguai e Atlântico Sul.
 */

import type { RiverPathSegment } from './hydroRiverNetworkData';

export const HYDRO_RIVER_NETWORK_SOUTH: RiverPathSegment[] = [
  // =========================================================================
  // 4. BACIA DO PARANÁ & PLATINA - VEIOS MAGENTA / ROSA (#ec4899 / #f472b6)
  // =========================================================================
  {
    id: 'prn-rio-parana',
    regionId: 'parana',
    color: '#ec4899',
    strokeWidth: 4.8,
    opacity: 0.96,
    d: 'M 1260,780 C 1220,840 1190,920 1170,990 C 1160,1030 1150,1070 1140,1110',
    name: 'Rio Paraná (Itaipu Binacional)',
    isMainTrunk: true,
  },
  {
    id: 'prn-rio-tiete',
    regionId: 'parana',
    color: '#f472b6',
    strokeWidth: 3.2,
    opacity: 0.9,
    d: 'M 1365,920 C 1320,910 1280,890 1240,860',
    name: 'Rio Tietê',
    isMainTrunk: true,
  },
  {
    id: 'prn-rio-paranapanema',
    regionId: 'parana',
    color: '#f472b6',
    strokeWidth: 2.8,
    opacity: 0.88,
    d: 'M 1315,950 C 1270,940 1240,920 1205,900',
    name: 'Rio Paranapanema',
  },
  {
    id: 'prn-rio-iguacu',
    regionId: 'parana',
    color: '#f472b6',
    strokeWidth: 3.0,
    opacity: 0.9,
    d: 'M 1290,980 C 1250,985 1200,990 1170,995',
    name: 'Rio Iguaçu (Cataratas do Iguaçu)',
    isMainTrunk: true,
  },
  {
    id: 'prn-rio-grande-sp-mg',
    regionId: 'parana',
    color: '#fbcfe8',
    strokeWidth: 2.4,
    opacity: 0.85,
    d: 'M 1380,840 C 1340,830 1300,810 1260,785',
    name: 'Rio Grande (Furnas)',
  },
  {
    id: 'prn-dendrites',
    regionId: 'parana',
    color: '#fce7f3',
    strokeWidth: 1.4,
    opacity: 0.75,
    d: 'M 1270,890 C 1250,880 1240,865 1225,850 M 1230,950 C 1210,940 1195,930 1180,910 M 1260,965 C 1240,965 1220,970 1200,975',
  },

  // =========================================================================
  // 5. BACIA DO PARAGUAI (PANTANAL) - VEIOS TURQUESA (#06b6d4 / #22d3ee)
  // =========================================================================
  {
    id: 'parag-rio-paraguai',
    regionId: 'paraguai',
    color: '#06b6d4',
    strokeWidth: 4.2,
    opacity: 0.95,
    d: 'M 1070,680 C 1075,740 1065,800 1060,860 C 1055,910 1060,960 1065,1010',
    name: 'Rio Paraguai (Pantanal Matogrossense)',
    isMainTrunk: true,
  },
  {
    id: 'parag-rio-cuiaba',
    regionId: 'paraguai',
    color: '#22d3ee',
    strokeWidth: 2.6,
    opacity: 0.9,
    d: 'M 1130,650 C 1115,690 1095,730 1075,760',
    name: 'Rio Cuiabá',
  },
  {
    id: 'parag-rio-taquari-ms',
    regionId: 'paraguai',
    color: '#67e8f9',
    strokeWidth: 2.2,
    opacity: 0.85,
    d: 'M 1135,780 C 1110,800 1085,810 1065,820',
    name: 'Rio Taquari (Pantanal)',
  },

  // =========================================================================
  // 6. BACIA DO PARNAÍBA - VEIOS ÂMBAR DOURADO (#f59e0b / #fbbf24)
  // =========================================================================
  {
    id: 'parnaiba-tronco',
    regionId: 'parnaiba',
    color: '#f59e0b',
    strokeWidth: 4.0,
    opacity: 0.95,
    d: 'M 1390,560 C 1410,500 1440,450 1460,390',
    name: 'Rio Parnaíba (Delta das Américas)',
    isMainTrunk: true,
  },
  {
    id: 'parnaiba-rio-poti',
    regionId: 'parnaiba',
    color: '#fbbf24',
    strokeWidth: 2.2,
    opacity: 0.85,
    d: 'M 1480,450 C 1465,445 1450,440 1435,435',
    name: 'Rio Poti (Teresina)',
  },

  // =========================================================================
  // 7. BACIAS DO ATLÂNTICO LESTE & SUDESTE (#fb923c & #f97316)
  // =========================================================================
  {
    id: 'atl-rio-doce',
    regionId: 'atlantico_sudeste',
    color: '#f97316',
    strokeWidth: 3.2,
    opacity: 0.9,
    d: 'M 1440,800 C 1475,810 1510,815 1540,820',
    name: 'Rio Doce (MG/ES)',
    isMainTrunk: true,
  },
  {
    id: 'atl-rio-paraiba-sul',
    regionId: 'atlantico_sudeste',
    color: '#f97316',
    strokeWidth: 3.0,
    opacity: 0.9,
    d: 'M 1410,880 C 1445,885 1480,880 1510,875',
    name: 'Rio Paraíba do Sul (SP/RJ)',
    isMainTrunk: true,
  },
  {
    id: 'atl-rio-jequitinhonha',
    regionId: 'atlantico_leste',
    color: '#fb923c',
    strokeWidth: 2.8,
    opacity: 0.88,
    d: 'M 1450,730 C 1490,735 1530,730 1565,725',
    name: 'Rio Jequitinhonha (MG/BA)',
  },

  // =========================================================================
  // 8. BACIA DO URUGUAI & ATLÂNTICO SUL (#38bdf8 & #e11d48)
  // =========================================================================
  {
    id: 'urg-rio-uruguai',
    regionId: 'uruguai',
    color: '#38bdf8',
    strokeWidth: 3.8,
    opacity: 0.92,
    d: 'M 1270,1030 C 1220,1040 1170,1050 1130,1065',
    name: 'Rio Uruguai (UHE Itá / Machadinho)',
    isMainTrunk: true,
  },
  {
    id: 'urg-rio-jacui-guaiba',
    regionId: 'atlantico_sul',
    color: '#f43f5e',
    strokeWidth: 3.2,
    opacity: 0.9,
    d: 'M 1190,1090 C 1215,1100 1235,1110 1245,1135',
    name: 'Rio Jacuí / Lago Guaíba / Lagoa dos Patos',
    isMainTrunk: true,
  },
];
