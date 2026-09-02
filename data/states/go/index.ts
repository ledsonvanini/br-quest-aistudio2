// State Data Module: Goiás (GO)
// Unified module for GO packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'GO';
export const info = BRAZIL_STATES_REGISTRY['GO'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'GO')!;
export const anthems = ANTHEMS_BY_STATE['GO'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['GO'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['GO'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['GO'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['GO'];
export const speech = GUARDIAN_SPEECHES['GO'];

export const bundle: StateDataBundle = {
  uf: 'GO',
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
