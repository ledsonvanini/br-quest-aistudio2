// Unified States Architecture Index
// Provides organized access and single-source-of-truth for all 26 states + Federal District
export * from './types';
import type { StateDataBundle } from './types';
import type { GuardianData } from '../../types';

import { BRAZIL_STATES_REGISTRY } from '../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../guardiansData';
import { ANTHEMS_BY_STATE } from '../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../culturalInventoryData';
import { STATES_GEOPOLITICS_DATA } from '../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../guardianPhrases';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function buildBundle(uf: string): StateDataBundle {
  const upperUf = uf.toUpperCase();
  const info = BRAZIL_STATES_REGISTRY[upperUf] || {
    id: upperUf,
    name: upperUf,
    capital: '',
    region: 'Sudeste' as const,
    coatOfArmsUrl: '',
    flagSymbol: '🇧🇷',
    flagUrl: `/flags/${upperUf.toLowerCase()}.svg`,
    centroid: [0, 0] as [number, number],
  };

  const guardian = (GUARDIANS_DATA.find((g) => g.id.toUpperCase() === upperUf) || GUARDIANS_DATA[0]) as GuardianData;

  return {
    uf: upperUf,
    info,
    guardian,
    anthems: ANTHEMS_BY_STATE[upperUf],
    culturalItems: CULTURAL_INVENTORY_BY_STATE[upperUf] || [],
    geopolitics: STATES_GEOPOLITICS_DATA[upperUf],
    climatology: STATE_CLIMATOLOGY_DATABASE[upperUf],
    biodiversity: STATE_BIODIVERSITY_PROFILES[upperUf],
    speech: GUARDIAN_SPEECHES[upperUf],
  };
}

export const ALL_STATE_BUNDLES: Record<string, StateDataBundle> = Object.fromEntries(
  UFS.map((uf) => [uf, buildBundle(uf)])
);

export const ALL_STATES_LIST: StateDataBundle[] = Object.values(ALL_STATE_BUNDLES);

// Individual state bundles
export const ac = ALL_STATE_BUNDLES['AC'];
export const al = ALL_STATE_BUNDLES['AL'];
export const ap = ALL_STATE_BUNDLES['AP'];
export const am = ALL_STATE_BUNDLES['AM'];
export const ba = ALL_STATE_BUNDLES['BA'];
export const ce = ALL_STATE_BUNDLES['CE'];
export const df = ALL_STATE_BUNDLES['DF'];
export const es = ALL_STATE_BUNDLES['ES'];
export const go = ALL_STATE_BUNDLES['GO'];
export const ma = ALL_STATE_BUNDLES['MA'];
export const mt = ALL_STATE_BUNDLES['MT'];
export const ms = ALL_STATE_BUNDLES['MS'];
export const mg = ALL_STATE_BUNDLES['MG'];
export const pa = ALL_STATE_BUNDLES['PA'];
export const pb = ALL_STATE_BUNDLES['PB'];
export const pr = ALL_STATE_BUNDLES['PR'];
export const pe = ALL_STATE_BUNDLES['PE'];
export const pi = ALL_STATE_BUNDLES['PI'];
export const rj = ALL_STATE_BUNDLES['RJ'];
export const rn = ALL_STATE_BUNDLES['RN'];
export const rs = ALL_STATE_BUNDLES['RS'];
export const ro = ALL_STATE_BUNDLES['RO'];
export const rr = ALL_STATE_BUNDLES['RR'];
export const sc = ALL_STATE_BUNDLES['SC'];
export const sp = ALL_STATE_BUNDLES['SP'];
export const se = ALL_STATE_BUNDLES['SE'];
export const to = ALL_STATE_BUNDLES['TO'];

export function getStateBundle(uf: string): StateDataBundle | undefined {
  return ALL_STATE_BUNDLES[uf.toUpperCase()];
}

export function getStateInfo(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.info;
}

export function getStateGuardian(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.guardian;
}

export function getStateAnthems(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.anthems;
}

export function getStateCulturalItems(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.culturalItems || [];
}

export function getStateGeopolitics(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.geopolitics;
}

export function getStateClimatology(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.climatology;
}

export function getStateBiodiversity(uf: string) {
  return ALL_STATE_BUNDLES[uf.toUpperCase()]?.biodiversity;
}

export function getStateFlagUrl(uf: string): string {
  const state = ALL_STATE_BUNDLES[uf.toUpperCase()]?.info;
  if (state?.flagUrl) return state.flagUrl;
  return `/flags/${uf.toLowerCase()}.svg`;
}

export function getStateCoatOfArmsUrl(uf: string): string {
  const state = ALL_STATE_BUNDLES[uf.toUpperCase()]?.info;
  return state?.coatOfArmsUrl || '';
}

