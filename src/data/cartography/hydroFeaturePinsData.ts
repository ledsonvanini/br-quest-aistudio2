/**
 * hydroFeaturePinsData.ts
 * Pontos de Interesse Hidrográfico Nacional (ANA):
 * Grandes Usinas Hidrelétricas (UHE), Cataratas, Deltas e Encontros das Águas.
 */

export interface HydroFeaturePin {
  id: string;
  name: string;
  type: 'dam' | 'waterfall' | 'confluence' | 'mouth';
  x: number;
  y: number;
  river: string;
  state?: string;
  capacity?: string;
  curiosity?: string;
}

export const MAJOR_HYDRO_PINS: HydroFeaturePin[] = [
  {
    id: 'dam-itaipu',
    name: 'UHE Itaipu Binacional',
    type: 'dam',
    x: 1170,
    y: 995,
    river: 'Rio Paraná',
    state: 'PR',
    capacity: '14.000 MW',
    curiosity: 'Uma das maiores geradoras de energia limpa e renovável do planeta.',
  },
  {
    id: 'dam-belo-monte',
    name: 'UHE Belo Monte',
    type: 'dam',
    x: 1195,
    y: 360,
    river: 'Rio Xingu',
    state: 'PA',
    capacity: '11.233 MW',
    curiosity: 'Maior usina 100% brasileira em capacidade instalada.',
  },
  {
    id: 'dam-tucurui',
    name: 'UHE Tucuruí',
    type: 'dam',
    x: 1295,
    y: 335,
    river: 'Rio Tocantins',
    state: 'PA',
    capacity: '8.370 MW',
    curiosity: 'Espinha dorsal do fornecimento elétrico do Norte e Nordeste.',
  },
  {
    id: 'dam-xingo',
    name: 'UHE Xingó',
    type: 'dam',
    x: 1610,
    y: 565,
    river: 'Rio São Francisco',
    state: 'AL',
    capacity: '3.162 MW',
    curiosity: 'Encravada nos cânions do Velho Chico entre Alagoas e Sergipe.',
  },
  {
    id: 'dam-sobradinho',
    name: 'UHE Sobradinho',
    type: 'dam',
    x: 1515,
    y: 545,
    river: 'Rio São Francisco',
    state: 'BA',
    capacity: '1.050 MW',
    curiosity: 'Lago artificial gigantesco regulador da vazão do Nordeste.',
  },
  {
    id: 'dam-furnas',
    name: 'UHE Furnas',
    type: 'dam',
    x: 1390,
    y: 835,
    river: 'Rio Grande',
    state: 'MG',
    capacity: '1.216 MW',
    curiosity: 'Mar de Minas, pioneira na integração elétrica do Sudeste.',
  },
  {
    id: 'waterfall-iguacu',
    name: 'Cataratas do Iguaçu',
    type: 'waterfall',
    x: 1165,
    y: 1005,
    river: 'Rio Iguaçu',
    state: 'PR',
    curiosity: 'Maravilha Natural Mundial com até 275 quedas d’água impressionantes.',
  },
  {
    id: 'confluence-encontro-aguas',
    name: 'Encontro das Águas',
    type: 'confluence',
    x: 925,
    y: 405,
    river: 'Rio Negro & Solimões',
    state: 'AM',
    curiosity: 'Mais de 6 km correndo lado a lado sem se misturar devido a temperatura e densidade.',
  },
  {
    id: 'mouth-amazonas',
    name: 'Foz do Rio Amazonas',
    type: 'mouth',
    x: 1330,
    y: 260,
    river: 'Rio Amazonas',
    state: 'AP',
    curiosity: 'Despeja cerca de 209.000 m³/s de água doce no Oceano Atlântico.',
  },
  {
    id: 'mouth-parnaiba',
    name: 'Delta do Parnaíba',
    type: 'mouth',
    x: 1460,
    y: 385,
    river: 'Rio Parnaíba',
    state: 'PI',
    curiosity: 'Único delta em mar aberto das Américas com labirinto de ilhas e igarapés.',
  },
  {
    id: 'mouth-sao-francisco',
    name: 'Foz do São Francisco',
    type: 'mouth',
    x: 1630,
    y: 575,
    river: 'Rio São Francisco',
    state: 'AL',
    curiosity: 'Encontro histórico com o oceano entre Alagoas e Sergipe.',
  },
];
