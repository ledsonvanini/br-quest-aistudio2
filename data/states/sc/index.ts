// State Data Module: Santa Catarina (SC)
// Unified module for SC packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'SC';
export const info = BRAZIL_STATES_REGISTRY['SC'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'SC')!;
export const anthems = ANTHEMS_BY_STATE['SC'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['SC'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['SC'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['SC'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['SC'];
export const speech = GUARDIAN_SPEECHES['SC'];

export const bundle: StateDataBundle = {
  uf: 'SC',
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
