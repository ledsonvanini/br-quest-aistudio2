// State Data Module: Pará (PA)
// Unified module for PA packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'PA';
export const info = BRAZIL_STATES_REGISTRY['PA'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'PA')!;
export const anthems = ANTHEMS_BY_STATE['PA'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['PA'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['PA'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['PA'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['PA'];
export const speech = GUARDIAN_SPEECHES['PA'];

export const bundle: StateDataBundle = {
  uf: 'PA',
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
