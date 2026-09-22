// src/data/geopolitica/divisoesRegionais.ts
// Divisões Regionais Brasileiras Contemporâneas:
// 1. Macrorregiões Oficiais do IBGE (1969/1988)
// 2. Complexos Geoeconômicos de Pedro Pinchas Geiger (1967)
// 3. Os Quatro Brasis de Milton Santos e Maria Laura Silveira (2001)

export type TipoDivisaoRegional =
  | 'ibge_macrorregioes'
  | 'geoeconomica_geiger'
  | 'quatro_brasis_milton';

export interface RegionalDivisionInfo {
  id: TipoDivisaoRegional;
  nome: string;
  autorOuOrgao: string;
  ano: string;
  descricaoCurta: string;
  criterioBase: string;
  regioes: {
    id: string;
    nome: string;
    corHex: string;
    badgeBg: string;
    descricao: string;
    estadosPrincipais: string[];
    caracteristicaSocioEconomica: string;
  }[];
}

export const DIVISOES_REGIONAIS_BRASIL: Record<TipoDivisaoRegional, RegionalDivisionInfo> = {
  ibge_macrorregioes: {
    id: 'ibge_macrorregioes',
    nome: '5 Macrorregiões Oficiais (IBGE)',
    autorOuOrgao: 'Instituto Brasileiro de Geografia e Estatística (IBGE)',
    ano: '1969 (Revisada em 1988)',
    descricaoCurta: 'Divisão político-administrativa respeitando estritamente as fronteiras estaduais.',
    criterioBase: 'Critérios de continuidade geográfica, aspectos naturais, humanos e conveniência estatística.',
    regioes: [
      {
        id: 'norte',
        nome: 'Norte',
        corHex: '#10b981',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        descricao: 'Maior extensão territorial, abriga a Bacia Amazônica e a maior floresta tropical do planeta.',
        estadosPrincipais: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
        caracteristicaSocioEconomica: 'Fronteira mineral, bioeconomia, Zona Franca de Manaus e agronegócio no sul do Pará.',
      },
      {
        id: 'nordeste',
        nome: 'Nordeste',
        corHex: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        descricao: 'Primeira região colonizada, com forte diversidade da Zona da Mata ao Sertão semiárido.',
        estadosPrincipais: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
        caracteristicaSocioEconomica: 'Polo de energia eólica e solar, polo petroquímico de Camaçari, fruticultura irrigada e turismo.',
      },
      {
        id: 'centro_oeste',
        nome: 'Centro-Oeste',
        corHex: '#eab308',
        badgeBg: 'rgba(234, 179, 8, 0.2)',
        descricao: 'Coração do Planalto Central, abriga a Capital Federal e biomas Cerrado e Pantanal.',
        estadosPrincipais: ['DF', 'GO', 'MT', 'MS'],
        caracteristicaSocioEconomica: 'Liderança global no agronegócio de grãos (soja/milho) e pecuária intensiva de corte.',
      },
      {
        id: 'sudeste',
        nome: 'Sudeste',
        corHex: '#0284c7',
        badgeBg: 'rgba(2, 132, 199, 0.2)',
        descricao: 'Região mais populosa, concentrando mais de 50% do PIB e a maior malha industrial do país.',
        estadosPrincipais: ['ES', 'MG', 'RJ', 'SP'],
        caracteristicaSocioEconomica: 'Centro financeiro (Faria Lima), indústria automobilística, extração de petróleo no pré-sal e serviços.',
      },
      {
        id: 'sul',
        nome: 'Sul',
        corHex: '#a855f7',
        badgeBg: 'rgba(168, 85, 247, 0.2)',
        descricao: 'Clima subtropical temperado, altos índices de desenvolvimento humano e forte agricultura familiar.',
        estadosPrincipais: ['PR', 'RS', 'SC'],
        caracteristicaSocioEconomica: 'Indústria agroalimentar, cooperativismo de ponta, polos metalmecânicos e de tecnologia.',
      },
    ],
  },

  geoeconomica_geiger: {
    id: 'geoeconomica_geiger',
    nome: '3 Complexos Geoeconômicos (Geiger)',
    autorOuOrgao: 'Pedro Pinchas Geiger (Geógrafo)',
    ano: '1967',
    descricaoCurta: 'Não respeita os limites político-estaduais, focando nas relações históricas e econômicas.',
    criterioBase: 'Integração econômica, formação histórica do território e relações de subordinação/produção.',
    regioes: [
      {
        id: 'amazonia',
        nome: 'Complexo da Amazônia',
        corHex: '#059669',
        badgeBg: 'rgba(5, 150, 105, 0.2)',
        descricao: 'Espaço de baixa densidade demográfica, grande floresta contínua e fronteira pioneira.',
        estadosPrincipais: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'],
        caracteristicaSocioEconomica: 'Projetos minerais em Carajás, ZFM de Manaus, avanço da fronteira agropecuária do arco do desmatamento.',
      },
      {
        id: 'nordeste',
        nome: 'Complexo do Nordeste',
        corHex: '#ea580c',
        badgeBg: 'rgba(234, 88, 12, 0.2)',
        descricao: 'Região de ocupação colonial secular marcada por contrastes do semiárido e heranças fundiárias.',
        estadosPrincipais: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
        caracteristicaSocioEconomica: 'Transição agroindustrial (MATOPIBA), polo tecnológico de Recife, turismo litorâneo e semiárido resiliente.',
      },
      {
        id: 'centro_sul',
        nome: 'Complexo Centro-Sul',
        corHex: '#2563eb',
        badgeBg: 'rgba(37, 99, 235, 0.2)',
        descricao: 'O motor hegemônico nacional, articulando a agricultura de alta precisão com a metrópole de comando.',
        estadosPrincipais: ['DF', 'ES', 'GO', 'MG', 'MS', 'MT', 'PR', 'RJ', 'RS', 'SC', 'SP'],
        caracteristicaSocioEconomica: 'Maior concentração de capital, complexos sucroalcooleiros, tecnologia industrial e mercado consumidor maciço.',
      },
    ],
  },

  quatro_brasis_milton: {
    id: 'quatro_brasis_milton',
    nome: 'Os Quatro Brasis (Milton Santos)',
    autorOuOrgao: 'Milton Santos e Maria Laura Silveira',
    ano: '2001 (O Brasil: Território e Sociedade no Século XXI)',
    descricaoCurta: 'Baseada na difusão desigual do "Meio Técnico-Científico-Informacional".',
    criterioBase: 'Densidade de tecnologia, fluxos de informação, finanças e infraestruturas modernas.',
    regioes: [
      {
        id: 'regiao_concentrada',
        nome: 'Região Concentrada',
        corHex: '#3b82f6',
        badgeBg: 'rgba(59, 130, 246, 0.2)',
        descricao: 'Área com densidade máxima de redes técnicas, capitais, telecomunicações e centros de decisão.',
        estadosPrincipais: ['ES', 'MG', 'PR', 'RJ', 'RS', 'SC', 'SP'],
        caracteristicaSocioEconomica: 'Fluxos corporativos mundiais, megalópole SP-Rio, comando financeiro e inovação universitária.',
      },
      {
        id: 'centro_oeste_modernizado',
        nome: 'Centro-Oeste Modernizado',
        corHex: '#facc15',
        badgeBg: 'rgba(250, 204, 21, 0.2)',
        descricao: 'Espaço agrícola altamente mecanizado, subordinado à lógica das tradings e dos fluxos globais.',
        estadosPrincipais: ['DF', 'GO', 'MS', 'MT'],
        caracteristicaSocioEconomica: 'Agricultura 4.0, biotecnologia de sementes, silos automatizados e articulação com ferrovias de exportação.',
      },
      {
        id: 'nordeste_resiliente',
        nome: 'Nordeste Histórico',
        corHex: '#f97316',
        badgeBg: 'rgba(249, 115, 22, 0.2)',
        descricao: 'Espaço com difusão pontual da modernidade em meio a heranças de vulnerabilidade social.',
        estadosPrincipais: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
        caracteristicaSocioEconomica: 'Enclaves agroexportadores irrigados (Vale do São Francisco), energia limpa e pólos de serviços costeiros.',
      },
      {
        id: 'amazonia_fronteira',
        nome: 'Amazônia Fronteiriça',
        corHex: '#10b981',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        descricao: 'Vasto território de rarefeitas redes técnicas e telemáticas, cobiçado por recursos ecológicos e minerais.',
        estadosPrincipais: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'],
        caracteristicaSocioEconomica: 'Economia da floresta em pé versus pressões de extração madeireira, garimpo e expansão de rodovias.',
      },
    ],
  },
};

/**
 * Retorna a Região Geoeconômica de Pedro Pinchas Geiger para um dado estado.
 */
export function getGeoeconomicRegionForState(stateId: string): { id: string; nome: string; corHex: string } {
  const s = stateId.toUpperCase();
  if (['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'].includes(s)) {
    return { id: 'amazonia', nome: 'Complexo da Amazônia', corHex: '#059669' };
  }
  if (['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(s)) {
    return { id: 'nordeste', nome: 'Complexo do Nordeste', corHex: '#ea580c' };
  }
  return { id: 'centro_sul', nome: 'Complexo Centro-Sul', corHex: '#2563eb' };
}

/**
 * Retorna a Região dos "Quatro Brasis" de Milton Santos para um dado estado.
 */
export function getMiltonSantosRegionForState(stateId: string): { id: string; nome: string; corHex: string } {
  const s = stateId.toUpperCase();
  if (['SP', 'RJ', 'ES', 'MG', 'PR', 'SC', 'RS'].includes(s)) {
    return { id: 'regiao_concentrada', nome: 'Região Concentrada', corHex: '#3b82f6' };
  }
  if (['DF', 'GO', 'MS', 'MT'].includes(s)) {
    return { id: 'centro_oeste_modernizado', nome: 'Centro-Oeste Modernizado', corHex: '#facc15' };
  }
  if (['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(s)) {
    return { id: 'nordeste_resiliente', nome: 'Nordeste Histórico', corHex: '#f97316' };
  }
  return { id: 'amazonia_fronteira', nome: 'Amazônia Fronteiriça', corHex: '#10b981' };
}
