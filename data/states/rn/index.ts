// State Data Module: Rio Grande do Norte (RN)
// Unified module for RN packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'RN';
export const info = BRAZIL_STATES_REGISTRY['RN'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'RN')!;
export const anthems = ANTHEMS_BY_STATE['RN'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['RN'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['RN'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['RN'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['RN'];
export const speech = GUARDIAN_SPEECHES['RN'];

export const bundle: StateDataBundle = {
  uf: 'RN',
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
