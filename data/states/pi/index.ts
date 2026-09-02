// State Data Module: Piauí (PI)
// Unified module for PI packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'PI';
export const info = BRAZIL_STATES_REGISTRY['PI'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'PI')!;
export const anthems = ANTHEMS_BY_STATE['PI'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['PI'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['PI'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['PI'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['PI'];
export const speech = GUARDIAN_SPEECHES['PI'];

export const bundle: StateDataBundle = {
  uf: 'PI',
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
