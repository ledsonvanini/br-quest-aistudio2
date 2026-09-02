// State Data Module: Roraima (RR)
// Unified module for RR packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'RR';
export const info = BRAZIL_STATES_REGISTRY['RR'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'RR')!;
export const anthems = ANTHEMS_BY_STATE['RR'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['RR'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['RR'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['RR'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['RR'];
export const speech = GUARDIAN_SPEECHES['RR'];

export const bundle: StateDataBundle = {
  uf: 'RR',
  info,
  guardian,
  anthems,
  culturalItems: cultural,
  geopolitics,
  climatology,
  biodiversity,
  speech,
};

export default bundle;
