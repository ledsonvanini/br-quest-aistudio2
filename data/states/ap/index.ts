// State Data Module: Amapá (AP)
// Unified module for AP packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'AP';
export const info = BRAZIL_STATES_REGISTRY['AP'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'AP')!;
export const anthems = ANTHEMS_BY_STATE['AP'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['AP'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['AP'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['AP'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['AP'];
export const speech = GUARDIAN_SPEECHES['AP'];

export const bundle: StateDataBundle = {
  uf: 'AP',
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
