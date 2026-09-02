// State Data Module: Ceará (CE)
// Unified module for CE packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'CE';
export const info = BRAZIL_STATES_REGISTRY['CE'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'CE')!;
export const anthems = ANTHEMS_BY_STATE['CE'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['CE'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['CE'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['CE'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['CE'];
export const speech = GUARDIAN_SPEECHES['CE'];

export const bundle: StateDataBundle = {
  uf: 'CE',
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
