// State Data Module: Espírito Santo (ES)
// Unified module for ES packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'ES';
export const info = BRAZIL_STATES_REGISTRY['ES'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'ES')!;
export const anthems = ANTHEMS_BY_STATE['ES'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['ES'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['ES'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['ES'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['ES'];
export const speech = GUARDIAN_SPEECHES['ES'];

export const bundle: StateDataBundle = {
  uf: 'ES',
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
