// Unified States Architecture Index
// Provides organized imports and access for all 26 states + Federal District
export * from './types';

import { bundle as bundle_ac } from './ac';
import { bundle as bundle_ap } from './ap';
import { bundle as bundle_am } from './am';
import { bundle as bundle_pa } from './pa';
import { bundle as bundle_ro } from './ro';
import { bundle as bundle_rr } from './rr';
import { bundle as bundle_to } from './to';
import { bundle as bundle_al } from './al';
import { bundle as bundle_ba } from './ba';
import { bundle as bundle_ce } from './ce';
import { bundle as bundle_ma } from './ma';
import { bundle as bundle_pb } from './pb';
import { bundle as bundle_pe } from './pe';
import { bundle as bundle_pi } from './pi';
import { bundle as bundle_rn } from './rn';
import { bundle as bundle_se } from './se';
import { bundle as bundle_df } from './df';
import { bundle as bundle_go } from './go';
import { bundle as bundle_mt } from './mt';
import { bundle as bundle_ms } from './ms';
import { bundle as bundle_es } from './es';
import { bundle as bundle_mg } from './mg';
import { bundle as bundle_rj } from './rj';
import { bundle as bundle_sp } from './sp';
import { bundle as bundle_pr } from './pr';
import { bundle as bundle_rs } from './rs';
import { bundle as bundle_sc } from './sc';

export * as ac from './ac';
export * as ap from './ap';
export * as am from './am';
export * as pa from './pa';
export * as ro from './ro';
export * as rr from './rr';
export * as to from './to';
export * as al from './al';
export * as ba from './ba';
export * as ce from './ce';
export * as ma from './ma';
export * as pb from './pb';
export * as pe from './pe';
export * as pi from './pi';
export * as rn from './rn';
export * as se from './se';
export * as df from './df';
export * as go from './go';
export * as mt from './mt';
export * as ms from './ms';
export * as es from './es';
export * as mg from './mg';
export * as rj from './rj';
export * as sp from './sp';
export * as pr from './pr';
export * as rs from './rs';
export * as sc from './sc';

export const ALL_STATE_BUNDLES: Record<string, import('./types').StateDataBundle> = {
  AC: bundle_ac,
  AP: bundle_ap,
  AM: bundle_am,
  PA: bundle_pa,
  RO: bundle_ro,
  RR: bundle_rr,
  TO: bundle_to,
  AL: bundle_al,
  BA: bundle_ba,
  CE: bundle_ce,
  MA: bundle_ma,
  PB: bundle_pb,
  PE: bundle_pe,
  PI: bundle_pi,
  RN: bundle_rn,
  SE: bundle_se,
  DF: bundle_df,
  GO: bundle_go,
  MT: bundle_mt,
  MS: bundle_ms,
  ES: bundle_es,
  MG: bundle_mg,
  RJ: bundle_rj,
  SP: bundle_sp,
  PR: bundle_pr,
  RS: bundle_rs,
  SC: bundle_sc,
};

export const ALL_STATES_LIST = Object.values(ALL_STATE_BUNDLES);

export function getStateBundle(uf: string): import('./types').StateDataBundle | undefined {
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

