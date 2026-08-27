// src/types/geopolitica.ts
// Tipos para o Modo Geopolítica e Demografia Brasileira

import { RegionId } from '../types';

export type GeopoliticaMetricKey =
  | 'miscigenacao'
  | 'genero'
  | 'densidade'
  | 'natalidade'
  | 'mortalidade'
  | 'analfabetismo'
  | 'partidos';

export type GeopoliticaScope = 'nacional' | 'regional' | 'estadual';

export interface EthnicDistribution {
  pardoPercent: number;
  brancoPercent: number;
  pretoPercent: number;
  indigenaPercent: number;
  amareloPercent: number;
  // Totais absolutos aproximados base Censo 2022
  pardoTotal: number;
  brancoTotal: number;
  pretoTotal: number;
  indigenaTotal: number;
  amareloTotal: number;
}

export interface GenderDistribution {
  mulheresPercent: number;
  homensPercent: number;
  mulheresTotal: number;
  homensTotal: number;
  razaoDeSexo: number; // Número de homens para cada 100 mulheres (ex: 94.2)
}

export interface DemographicsProfile {
  populacaoTotal: number; // População Censo 2022
  populacaoEstimadaIBGE?: number; // Estimativa Atualizada IBGE (2024/2025)
  areaKm2: number;
  densidadeHabKm2: number;
  taxaUrbanizacao: number; // ex: 84.7 (%)
  populacaoIdosa60MaisPercent: number; // ex: 15.6 (%)
  populacaoJovem0a14Percent: number; // ex: 19.8 (%)
}

export interface VitalRatesProfile {
  taxaNatalidadePorMil: number; // Nascimentos por 1000 hab.
  taxaFecundidade: number; // Filhos por mulher
  taxaMortalidadeGeralPorMil: number; // Óbitos por 1000 hab.
  taxaMortalidadeInfantil: number; // Óbitos menores de 1 ano por 1000 nascidos vivos
  expectativaVidaAnos: number; // Expectativa de vida ao nascer
}

export interface EducationProfile {
  taxaAnalfabetismo15Mais: number; // Taxa de analfabetismo (%)
  taxaAlfabetizacao: number; // Taxa de alfabetização (%)
  anosMediosEstudo: number;
  totalAnalfabetos: number;
  taxaEnsinoSuperiorCompleto: number; // % com superior
}

export type PoliticalSpectrum = 'Esquerda' | 'Centro-Esquerda' | 'Centro' | 'Centro-Direita' | 'Direita';

export interface PoliticsProfile {
  governador: string;
  partidoGovernador: string;
  siglaPartido: string;
  partidoCorHex: string;
  espectroPolitico: PoliticalSpectrum;
  viceGovernador: string;
  mandato: string;
  bancadaFederalDeputados: number;
  senadores: string[];
  partidosPredominantesRegiao: string[];
}

export interface StateGeopoliticsProfile {
  stateId: string; // Ex: 'SP', 'BA', 'AM'
  stateName: string;
  capital: string;
  regionId: RegionId;
  regionName: string;
  bandeiraIcon?: string;
  
  etnia: EthnicDistribution;
  genero: GenderDistribution;
  demografia: DemographicsProfile;
  vitais: VitalRatesProfile;
  educacao: EducationProfile;
  politica: PoliticsProfile;
  
  destaquesSocioEconomicosPt: string[];
  desafiosRegionaisPt: string[];
  rankingPopulacaoNacional: number;
  rankingDensidadeNacional: number;
  rankingAlfabetizacaoNacional: number;
}

export interface RegionGeopoliticsSummary {
  regionId: RegionId;
  regionName: string;
  populacaoTotal: number;
  populacaoEstimadaIBGE?: number;
  areaKm2: number;
  densidadeMedia: number;
  etnia: EthnicDistribution;
  genero: GenderDistribution;
  taxaAnalfabetismoMedia: number;
  taxaNatalidadeMedia: number;
  taxaMortalidadeInfantilMedia: number;
  partidosGovernantes: { partido: string; estados: string[]; corHex: string }[];
  principaisCidades: string[];
}

export interface NationalGeopoliticsSummary {
  populacaoTotal: number;
  populacaoEstimadaIBGE: number; // Estimativa Atualizada IBGE (2024/2025 ~212,58M)
  anoReferenciaEstimativa: string;
  areaKm2: number;
  densidadeMedia: number;
  etnia: EthnicDistribution;
  genero: GenderDistribution;
  taxaAnalfabetismoGeral: number;
  taxaNatalidadeGeral: number;
  taxaMortalidadeGeral: number;
  taxaMortalidadeInfantil: number;
  expectativaVidaMedia: number;
  distribuicaoPartidariaGovernos: { partido: string; sigla: string; totalEstados: number; corHex: string; estados: string[] }[];
}
