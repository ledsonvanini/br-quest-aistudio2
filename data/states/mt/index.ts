// State Data Module: Mato Grosso (MT)
// Unified module for MT packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'MT';
export const info = BRAZIL_STATES_REGISTRY['MT'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'MT')!;
export const anthems = ANTHEMS_BY_STATE['MT'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['MT'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['MT'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['MT'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['MT'];
export const speech = GUARDIAN_SPEECHES['MT'];

export const bundle: StateDataBundle = {
  uf: 'MT',
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
